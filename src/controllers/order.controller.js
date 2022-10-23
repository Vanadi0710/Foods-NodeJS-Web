import DbService from "../services/DbService"
import ApiError from "../config/error.config"
import models from "../models"

const getOrders = async (req, res) => {
    let filter = {
        accountId: req.params.accountId
    }
    let dbOptions = {
        populate: 'products.product'
    }
    
    let orders = await DbService.findAndPaginate(models.OrderModel, filter, dbOptions, req)

    return res.json(orders)
}

const getOrdersPending = async (req, res) => {
    if(req.account.role != 'admin') {
        throw new ApiError(403, 'Not authorize')
    }

    let filter = {
        status: 'PENDING'
    }
    let dbOptions = {
        populate: 'products.product'
    }
    
    let orders = await DbService.findAndPaginate(models.OrderModel, filter, dbOptions, req)

    return res.json(orders)
}

const handleOrder = async (req, res) => {
    if(req.account.role != 'admin') {
        throw new ApiError(403, 'Not authorized')
    }

    let order = await DbService.updateOne(models.OrderModel, {_id: req.params.orderId}, {status: req.body.status}, {new: true, runValidators: true}, {notAllowNull: true})

    return res.json(order)
}

const addOrder = async (req, res) => {
    let docBody = {
        ...req.body,
        owner: req.account._id
    }
    let order = await DbService.create(models.OrderModel, req.body, docBody)

    return res.json(order)
}

const deleteOrder = async (req, res) => {
    if(req.account._id != req.params.accountId) {
        throw new ApiError(403, "Not authorized")
    }

    let filter = {
        accountId: req.params.accountId
    }
    let order = await DbService.deleteOne(models.OrderModel, filter, {}, {notAllowNull: true})

    return res.json(order)
}

module.exports = {
    getOrders,
    getOrdersPending,
    addOrder,
    deleteOrder,
    handleOrder
}
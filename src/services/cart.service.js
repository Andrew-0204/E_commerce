'use strict'

const {
    BadRequestError,
    NotFoundError
} = require("../core/error.response")
const { cart } = require('../models/cart.model')
const {
    getProductById
} = require('../models/repositories/product.repo')
/*

    Key features: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increase product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]

*/

class CartService {

    /// START REPO CART ///

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const query = {
            cart_userId: userId,
            'cart_products.productId': product.productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': product.quantity,
                'cart_products.$.price': product.price
            }
        }, options = { upsert: true, new: true }


        return await cart.findOneAndUpdate(query, updateSet, options)
    }


    /// END REPO CART ///

    static async addToCart({ userId, product = {} }) {
        // check cart is existed?
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create cart for User
            return await CartService.createUserCart({ userId, product })
        }

        // neu co ro hang roi nhung chua co san pham thi sao? 
        if (userCart.cart_products.length == 0) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // gio hang ton tai, va co san pham nay thi update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    // update cart
    /*
        stop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        quantity,
                        productId,
                    }
                ],
                version
            }
        ]
    */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity, price, old_price } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('')
        // compare 
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            // deleted
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
                price: price - old_price
            }
        })
    }
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadFileOnCloudinary} from '../utils/cloudinary.js';

const createProduct = asyncHandler(async(req,res)=>{
    
    const {name, description, price, stock, category, address, status} = req.body;
    const {user} = req;

    const productImgLocalPath = req.files?.productImage[0]?.path;
    
    const productImage = await uploadFileOnCloudinary(productImgLocalPath);

    if(!productImage){
        throw new ApiError(400, "Avatar file is required!!");
    }

    const product = await Product.create({
        name, 
        description,
        productImage: productImage.url,
        price,
        stock,
        category,
        address,
        status,
        owner: user._id
    })
    res.status(200).json(new ApiResponse(201, product, "product is added!!"))
})

const getProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find();

    if(!products){
        throw new ApiError(404, 'Products not found!!')
    }

    req.status(200).json(new ApiResponse(200, products, 'Products found')) 
})

const getProductById = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        throw new ApiError(404, 'Product not found!!')
    }

    req.status(200).json(new ApiResponse(200, product, 'Product found')) 
})

const updateProductById = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    res.status(200).json(new ApiResponse( 200, product, "Product updated successfully!!"));
})

const deleteProductById = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    res.status(200).json(new ApiResponse(200, product, 'Product deleted successfully!!'));
})


export {createProduct, getProductById, getProducts, updateProductById, deleteProductById};
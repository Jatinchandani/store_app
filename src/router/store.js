var express = require('express');
var router 	= express.Router();
const multer = require('multer')
const path = require('path')
const controller = require('../controller/index');
const { verifyTokenFn } = require("../lib/helper/jwt");

//image storage by multer part
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'upload', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
    }
  });
  //image upload and matching storage 
  const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
  })

//owner module router
router.post('/register', controller.storeUserController.userDetails);
router.get('/showProfile', verifyTokenFn,controller.storeUserController.ownerProfile);
router.put('/updateProfile', verifyTokenFn,controller.storeUserController.updateOwnerProfile);
router.delete('/deleteOwnerProfile/:id', verifyTokenFn, controller.storeUserController.deleteOwnerProfile);
router.post("/verify", controller.storeUserController.verifyOwner);

//upload picture
//single photo
//router.post('/profile',imageUpload.single('photo'),verifyTokenFn,controller.storeUserController.ProfileAdd)
//multiple photos
router.post('/profile',imageUpload.array('photo',10),verifyTokenFn, controller.storeUserController.ProfileAdd);

//business device
router.post('/createBusinessDevice/:id', verifyTokenFn, controller.storeUserController.createBusinessDevice);
router.get('/showsDeviceDetails/:id',verifyTokenFn,controller.storeUserController.showBusinessDevices)

//product module router
router.post('/createProduct',verifyTokenFn,controller.storeUserController.addProduct);
router.put('/updateProduct/:id', verifyTokenFn, controller.storeUserController.updateProduct);
router.get('/productProfile/:id', verifyTokenFn,controller.storeUserController.productProfile);
router.delete('/deleteProduct/:id', verifyTokenFn, controller.storeUserController.productDelete);

//product variant router
router.post('/createVariant/:id', verifyTokenFn, controller.storeUserController.createProductVariants);
router.put('/updatevariant/:id', verifyTokenFn, controller.storeUserController.updateVariant);
router.get('/showvariants/:id', verifyTokenFn, controller.storeUserController.variantsRead);
router.delete('/deletevariant/:id', verifyTokenFn, controller.storeUserController.variantDelete);

//category router
router.post('/createCategory/:id', verifyTokenFn,controller.storeUserController.addCategory);
router.get('/showCategories/:id', verifyTokenFn, controller.storeUserController.readCategories);
router.put('/updateCategory/:id', verifyTokenFn,controller.storeUserController.updateCategories);
router.delete('/deleteCategory/:id', verifyTokenFn, controller.storeUserController.deleteCategories);

//order router
router.post('/createOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.createOrder);
router.put('/updateOrder/:id', verifyTokenFn, controller.storeUserController.modifiedOrders);
router.get('/showOrders/:id', verifyTokenFn,controller.storeUserController.readOrders);
router.delete('/deleteOrder/:id', verifyTokenFn, controller.storeUserController.deleteOrders);
router.put('/acceptOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.acceptOrder);
router.put('/rejectOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.rejectOrder);
router.put('/shippedOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.shippedOrder);
router.put('/deliveredOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.deliveredOrder);
router.put('/cancelOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.cancelledOrder);
router.put('/failedOrder/:order_id/:id', verifyTokenFn, controller.storeUserController.failedOrder);

//order customer
router.post('/createOrderCustomer/:order_id', verifyTokenFn, controller.storeUserController.createOrderCustomer);
router.put('/updateOrderCustomer/:id', verifyTokenFn, controller.storeUserController.updateOrderCustomer);
router.get('/showOrderCust/:id', verifyTokenFn,controller.storeUserController.readOrderCust);
router.delete('/deleteOrderCust/:id', verifyTokenFn, controller.storeUserController.deleteOrderCust);
router.put('/acceptOrderCust/:order_id', verifyTokenFn, controller.storeUserController.acceptOrderCust);
router.put('/rejectOrderCust/:order_id', verifyTokenFn, controller.storeUserController.rejectOrderCust);
router.put('/shippedOrderCust/:order_id', verifyTokenFn, controller.storeUserController.shippedOrderCust);
router.put('/deliveredOrderCust/:order_id', verifyTokenFn, controller.storeUserController.deliveredOrderCust);
router.put('/cancelOrderCust/:order_id', verifyTokenFn, controller.storeUserController.cancelledOrderCust);
router.put('/failedOrderCust/:order_id', verifyTokenFn, controller.storeUserController.failedOrderCust);

//QR code
router.get('/qrcode', verifyTokenFn,controller.storeUserController.qrCode);

//coupon code
router.post('/couponAdd', verifyTokenFn,controller.storeUserController.createCoupon);
router.put('/updateCoupon/:id', verifyTokenFn, controller.storeUserController.updateCoupon);
router.get('/showCoupons/:id', verifyTokenFn, controller.storeUserController.readCoupons);
router.delete('/deleteCoupon/:id', verifyTokenFn, controller.storeUserController.couponDelete);


module.exports=router;
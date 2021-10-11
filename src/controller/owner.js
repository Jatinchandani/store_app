//require packages
const util = require("util");
let connection = require("../config/database");
const QRCode = require("qrcode");
let ConnectionUtil = util.promisify(connection.query).bind(connection);
//let oneTime = require("../lib/helper/otp");
let { issueJWT } = require("../lib/helper/jwt");

//register and login
module.exports.userDetails = async (req, res) => {
  try {
    var { mobile_number, otp } = req.body;
    let ONETIME = "12345";
    //check
    var userInfo = await ConnectionUtil(
      `select * from users where mobile_number='${mobile_number}'`
    );
    let userObj = {
      mobile_number: mobile_number,
      otp: otp,
    };

    if (userInfo != 0) {
      var user = await ConnectionUtil(
        `SELECT * FROM users WHERE mobile_number='${mobile_number}'`
      );
      console.log(user, "****");
      if (userInfo.isActive != 0) {
        let changeOtp = await ConnectionUtil(
          `update users set otp='${otp}' where mobile_number='${mobile_number}'`
        );
        console.log(changeOtp, "TTTT");
        const payload = {
          id: user[0].id,
          mobile_number: user[0].mobile_number,
          businessName: user[0].businessName,
          businessCategory: user[0].businessCategory,
          address: user[0].address,
          photo: user[0].photo,
          storeLink: user[0].storeLink,
        };
        console.log(payload, "%%%%%");
        const token = await issueJWT(payload);
        user[0].tokens = token;
        res.status(200).json({
          error: 0,
          success: true,
          message: "successfully over written",
          data: user[0],
        });
      } else {
        return res.status(200).json({
          success: false,
          message: " user is not verified",
        });
      }
    } else {
      var insertDetails = await ConnectionUtil(
        `insert into users set?`,
        userObj
      );
      var user = await ConnectionUtil(
        `SELECT * FROM users WHERE mobile_number='${mobile_number}'`
      );
      const payload = {
        id: user[0].id,
        mobile_number: user[0].mobile_number,
        businessName: user[0].businessName,
        businessCategory: user[0].businessCategory,
        address: user[0].address,
        photo: user[0].photo,
        storeLink: user[0].storeLink,
      };
      const token = await issueJWT(payload);
      user[0].tokens = token;
      res.status(200).json({
        success: true,
        message: "otp has been created",
        data: user[0],
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      status: "400",
      message: err.message,
    });
  }
};
//verify
module.exports.verifyOwner = async (req, res) => {
  try {
    let { mobile_number, otp } = req.body;
    let verifyProfile = await ConnectionUtil(
      `select * from users where mobile_number='${mobile_number}' AND otp='${otp}'`
    );
    if (verifyProfile != "") {
      let verifyingOtp = await ConnectionUtil(
        `UPDATE users SET isActive="1" WHERE mobile_number='${mobile_number}' and otp='${otp}'`
      );
      res.json({
        message: "Verification successful, you can now login",
      });
    } else {
      res.send("number or otp are not matched insert properly");
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//upload images
// module.exports.ProfileAdd = async (req, res) => {
//   try {
//     let pictureAdd = req.file
//     console.log(pictureAdd, "details......")
//     let { id } = req.user
//     console.log("id.....",id)
//     let addUser = await ConnectionUtil(`select * from users where id='${id}'`)
//     console.log(addUser, "user..........")
//     if (addUser != "") {
//         let user = {
//             photo:pictureAdd.path
//         }
//         let userUpdate = await ConnectionUtil(`insert into users set ?`, user)
//         //let setProfile = await ConnectionUtil(`update photos set photo='${user.photo}' where id='${id}'`)
//          console.log(userUpdate,".......")
//         res.status(200).json({
//             success: true,
//             message: "profile pic added",
//         })
//     } else {
//         res.status(404).json({
//             success: false,
//             message: "id not same",
//         })
//     }

// } catch (err) {
//     res.status(400).json({
//         success: false,
//         message: err.message
//     })
// }
// };
module.exports.ProfileAdd = async (req, res) => {
  try {
    let pictureLogo = req.files;
    var obj = [];
    for (let data of pictureLogo) {
      obj.push(data.path);
    }
    let { id } = req.user;
    let addUser = await ConnectionUtil(`select * from users where id='${id}'`);
    if (addUser != "") {
      let userUpdate = await ConnectionUtil(
        `update users set photo='${obj}' where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: "profile picture has been added",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "id is not same",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//-----owner profile show
module.exports.ownerProfile = async (req, res) => {
  try {
    var { id } = req.user;
    var user = await ConnectionUtil(`select * from users where id=?`, id);
    if (user == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Display Owner Information",
        data: user,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//-----owner profile update
module.exports.updateOwnerProfile = async (req, res) => {
  try {
    let { photo, storeLink, businessName, businessCategory, address } =
      req.body;
    var { id } = req.user;
    var user = await ConnectionUtil(`select * from users where  id=?`, id);
    if (user != "") {
      var user = await ConnectionUtil(
        `update users set 
          photo='${photo}',
          storeLink='${storeLink}', 
          businessName='${businessName}',
          businessCategory='${businessCategory}',
          address='${address}' where id='${id}'`
      );

      res.status(200).json({
        success: true,
        message: " owner details updated successfully",
        userData: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user dose not exist ",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports.deleteOwnerProfile = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let CheckValidUser = await ConnectionUtil(
      `select * from users where id='${id}'`
    );
    if (CheckValidUser != "") {
      let DeleteQuery = await ConnectionUtil(
        `delete from users where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Owner Profile Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Owner is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//-------------product
//create/add product
module.exports.addProduct = async (req, res) => {
  try {
    var {
      productName,
      product_photo,
      productCategory,
      productDetails,
      productPrice,
      discountedPrice,
      productQuantity,
      variants,
    } = req.body;
    var user_id = req.user.id;

    let userObj = {
      user_id: user_id,
      productName: productName,
      product_photo: product_photo,
      productCategory: productCategory,
      productDetails: productDetails,
      productPrice: productPrice,
      discountedPrice: discountedPrice,
      productQuantity: productQuantity,
      variants: variants,
    };
    var productInsertQuery = await ConnectionUtil(
      `INSERT INTO products SET ?`,
      userObj
    );
    if (productInsertQuery != 0) {
      res.status(200).json({
        error: 0,
        success: true,
        message: "product has been created successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//---update product details
module.exports.updateProduct = async (req, res) => {
  try {
    var {
      productName,
      product_photo,
      productCategory,
      productDetails,
      productPrice,
      discountedPrice,
      productQuantity,
      variants,
    } = req.body;

    let { id } = req.params;
    var user_id = req.user.id;
    var user = await ConnectionUtil(
      `select * from products where user_id='${user_id}' and id='${id}'`
    );
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update products set 
                     productName='${productName}',
                     productCategory='${productCategory}',
                     product_photo='${product_photo}',
                     productDetails='${productDetails}',
                     productPrice='${productPrice}', 
                     discountedPrice='${discountedPrice}',
                     productQuantity='${productQuantity}',
                     variants='${variants}' where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " product has been updated successfully...",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user does not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//-----product profile show
module.exports.productProfile = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user;
    var user = await ConnectionUtil(
      `select * from products where user_id='${user_id}' and id=?`,
      id
    );
    res.status(200).json({
      success: true,
      message: "Display Product Information",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//--------delete product
module.exports.productDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkProduct = await ConnectionUtil(
      `select * from products where user_id='${user_id}' and id='${id}'`
    );
    if (checkProduct != "") {
      let deleteProductQuery = await ConnectionUtil(
        `delete from products where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Product Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Product Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//----------business device
//------------------------------create
module.exports.createBusinessDevice = async (req, res) => {
  try {
    var { device_types } = req.body;
    var user_id = req.user.id;
    var businessDevice_id = req.params.id;
    var deviceDetails = await ConnectionUtil(
      `select * from businessdevices where user_id='${user_id}'`
    );
    if (deviceDetails == "") {
      let userObj = {
        user_id: user_id,
        businessDevice_id: businessDevice_id,
        device_type: device_types,
      };

      var deviceInsertQuery = await ConnectionUtil(
        `INSERT INTO businessdevices SET ?`,
        userObj
      );
      if (deviceInsertQuery != 0) {
        var userLog = await ConnectionUtil(
          `select * from businessdevices where device_type='${device_types}'`
        );
        // const deviceLoad = {
        //   id: userLog[0].id,
        //   businessDevice_id: userLog[0].businessDevice_id,
        //   user_id: userLog[0].user_id,
        //   device_type: userLog[0].device_types,
        // };
        // const token = await issueJWT(deviceLoad);
        // userLog[0].deviceTokens = token;
        res.status(200).json({
          error: 0,
          success: true,
          message: "device has been created successfully",
          data: userLog[0],
        });
      } else {
        res.status(404).json({
          success: false,
          message: "something went wrong",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        message: "device already existed",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//---show business device details
module.exports.showBusinessDevices = async (req, res) => {
  try {
    let user_id = req.user;
    let id = req.params;
    var deviceInfo = await ConnectionUtil(
      `select * from businessdevices where id='${id}' and user_id='${user_id}'`
    );
    res.status(200).json({
      success: true,
      message: "Display Business Device Details",
      data: deviceInfo,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//product variant
//------create product variant
module.exports.createProductVariants = async (req, res) => {
  try {
    let { variant_type, size_label, colour_label } = req.body;

    var { id } = req.user;
    let product_id = req.params.id;
    let userObj = {
      user_id: id,
      product_id: product_id,
      variant_type: variant_type,
      size_label: size_label,
      colour_label: colour_label,
    };
    var variantInsertQuery = await ConnectionUtil(
      `insert into productvariants set ?`,
      userObj
    );
    if (variantInsertQuery != 0) {
      res.status(200).json({
        error: 0,
        success: true,
        message: "variant has been created properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----update variant
module.exports.updateVariant = async (req, res) => {
  try {
    var { variant_type, size_label, colour_label } = req.body;

    let { id } = req.params;
    var user_id = req.user.id;
    var user = await ConnectionUtil(
      `select * from productvariants where user_id='${user_id}' and id='${id}'`
    );
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update productvariants set 
        variant_type='${variant_type}',
        size_label='${size_label}',
        colour_label='${colour_label}' where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " product variant has been updated successfully",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "variant not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//---show product variant
module.exports.variantsRead = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user.id;
    var user = await ConnectionUtil(
      `select * from productvariants where user_id='${user_id}' and id='${id}'`,
      id
    );
    if (user == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Display Product Variant Information",
        data: user,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//--------delete product
module.exports.variantDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkProduct = await ConnectionUtil(
      `select * from productvariants where user_id='${user_id}' and id='${id}'`
    );
    if (checkProduct != "") {
      let deleteVariantQuery = await ConnectionUtil(
        `delete from productvariants where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Product variant Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//------------category
//add category
module.exports.addCategory = async (req, res) => {
  try {
    var { categoryName, active, deactivate } = req.body;
    var { id } = req.user;
    var product_id = req.params.id;
    let userObj = {
      product_id: product_id,
      user_id: id, // user id = business_id
      categoryName: categoryName,
      activated: active,
      deactivated: deactivate,
    };
    var categoryInsertQuery = await ConnectionUtil(
      `INSERT INTO categories SET ?`,
      userObj
    );
    if (categoryInsertQuery != 0) {
      res.status(200).json({
        error: 0,
        success: true,
        message: "category has been created successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//read categories
module.exports.readCategories = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user.id;
    var userShow = await ConnectionUtil(
      `select * from categories where id='${id}' and user_id='${user_id}'`
    );
    if (userShow == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        error: 0,
        message: "Display categories details",
        data: userShow,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----update categories
module.exports.updateCategories = async (req, res) => {
  try {
    var { categoryName, activated, deactivated } = req.body;

    let { id } = req.params;
    var user_id = req.user.id;
    var user = await ConnectionUtil(
      `select * from categories where user_id='${user_id}' and id='${id}'`
    );
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update categories set 
        categoryName='${categoryName}',
        activated='${activated}',
        deactivated='${deactivated}' where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " category has been updated successfully",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "category not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----delete categories
module.exports.deleteCategories = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkCategory = await ConnectionUtil(
      `select * from categories where user_id='${user_id}' and id='${id}'`
    );
    if (checkCategory != "") {
      let deleteCategoryQuery = await ConnectionUtil(
        `delete from categories where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Category Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//----------------------order
module.exports.createOrder = async (req, res) => {
  try {
    // status = 1 means order is in pending
    let { productName, product_price, quantity, deliveryAmount } = req.body;

    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;
    let userObj = {
      order_id: order_id,
      product_id: product_id,
      productName: productName,
      product_price: product_price,
      quantity: quantity,
      deliveryAmount: deliveryAmount,
    };
    var orderInsertQuery = await ConnectionUtil(
      `insert into orders set ?`,
      userObj
    );
    if (orderInsertQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set isStatus='1' where order_id='${order_id}'`
      );
      console.log(providing, "####");
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been created properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----update orders
module.exports.modifiedOrders = async (req, res) => {
  // status = 5 means order is modified
  try {
    let {
      productName,
      product_price,
      quantity,
      deliveryAmount,
      isAccepted,
      isShipped,
      isRejected,
      isCancel,
      isFailed,
      isDelivered,
      isModified,
    } = req.body;

    let { id } = req.params;
    var product_id = req.params.id;
    var user = await ConnectionUtil(
      `select * from orders where id='${id}' and product_id='${product_id}'`
    );
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update orders set 
        productName='${productName}',
        product_price='${product_price}',
        quantity='${quantity}',
        deliveryAmount='${deliveryAmount}',
        isAccepted='${isAccepted}',
        isShipped='${isShipped}',
        isRejected='${isRejected}',
        isCancel='${isCancel}',
        isFailed='${isFailed}',
        isDelivered='${isDelivered}',
        isModified='${isModified}',
        isStatus='5'
         where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " orders has been updated successfully",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "order does not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----read orders
module.exports.readOrders = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user.id;
    var userShow = await ConnectionUtil(
      `select * from orders where id='${id}'`
    );
    if (userShow == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        error: 0,
        message: "Display orders details",
        data: userShow,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//---delete orders
module.exports.deleteOrders = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkCategory = await ConnectionUtil(
      `select * from orders where id='${id}'`
    );
    if (checkCategory != "") {
      let deleteOrderQuery = await ConnectionUtil(
        `delete from orders where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Order Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
//accept order
module.exports.acceptOrder = async (req, res) => {
  try {
    // status = 8 means order is accepted
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderAcceptQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderAcceptQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='8' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been accepted and updated properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order shipped
module.exports.shippedOrder = async (req, res) => {
  try {
    // status = 3 means order is shipped
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderShippedQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderShippedQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='3' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been shipped and updated information DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order rejected
module.exports.rejectOrder = async (req, res) => {
  try {
    // status = 2 means order is rejected
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderRejectQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderRejectQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='2' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been rejected and updated information DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order delivered
module.exports.deliveredOrder = async (req, res) => {
  try {
    // status = 4 means order is delivered
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderDeliverQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderDeliverQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='4' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message:
          "Order has been delivered successfully and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order cancelled
module.exports.cancelledOrder = async (req, res) => {
  try {
    // status = 6 means order is cancelled
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderCancelQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderCancelQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='6' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message:
          "Order has been cancelled successfully and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order cancelled
module.exports.failedOrder = async (req, res) => {
  try {
    // status = 7 means order is cancelled
    var { id } = req.user;
    let order_id = req.params.order_id;
    let product_id = req.params.id;

    var orderFailQuery = await ConnectionUtil(
      `select * from orders where id='${id}' and order_id='${order_id}' and product_id='${product_id}'`
    );
    if (orderFailQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update orders set 
        isStatus='7' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been Failed and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//-------------order customer
module.exports.createOrderCustomer = async (req, res) => {
  try {
    let {
      fullName,
      mobileNumber,
      address,
      pincode,
      city,
      state,
      paymentBy,
      orderStatus,
    } = req.body;

    var { id } = req.user;
    let order_id = req.params.order_id;
    //let business_id = req.params.id;
    let userObj = {
      order_id: order_id,
      business_id: id,
      fullName: fullName,
      mobileNumber: mobileNumber,
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      paymentBy: paymentBy,
      orderStatus: orderStatus,
    };
    var orderCustInsertQuery = await ConnectionUtil(
      `insert into ordercustomers set ?`,
      userObj
    );
    if (orderCustInsertQuery != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set orderStatus='1' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order Customer has been created properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//accept order
module.exports.acceptOrderCust = async (req, res) => {
  try {
    // status = 8 means order is accepted
    var { id } = req.user;
    console.log(id, "&&");
    let order_id = req.params.order_id;
    //let product_id = req.params.id;
    console.log(order_id, "PPP");
    var orderAcceptQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    console.log(orderAcceptQuery);
    if (orderAcceptQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='8' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been accepted and updated properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//---update order customer
module.exports.updateOrderCustomer = async (req, res) => {
  try {
    let {
      fullName,
      mobileNumber,
      address,
      pincode,
      city,
      state,
      paymentBy,
      isAccepted,
      isShipped,
      isRejected,
      isCancel,
      isFailed,
      isDelivered,
      isModified,
    } = req.body;
    let { id } = req.params;
    console.log(id, "$$$");
    var user = await ConnectionUtil(
      `select * from ordercustomers where id='${id}'`
    );
    console.log(user, "8787522");
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update ordercustomers set 
        fullName='${fullName}',
        mobileNumber='${mobileNumber}',
        address='${address}',
        pincode='${pincode}',
        city='${city}',
        state='${state}',
        paymentBy='${paymentBy}',
        isAccepted='${isAccepted}',
        isShipped='${isShipped}',
        isRejected='${isRejected}',
        isCancel='${isCancel}',
        isFailed='${isFailed}',
        isDelivered='${isDelivered}',
        isModified='${isModified}',
        isStatus='5'where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " order customer has been updated successfully",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "order not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order rejected
module.exports.rejectOrderCust = async (req, res) => {
  try {
    // status = 2 means order is rejected
    var { id } = req.user;
    let order_id = req.params.order_id;
    //let product_id = req.params.id;

    var orderRejectQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    if (orderRejectQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='2' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been rejected and updated information DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order shipped
module.exports.shippedOrderCust = async (req, res) => {
  try {
    // status = 3 means order is shipped
    var { id } = req.user;
    let order_id = req.params.order_id;
    //let product_id = req.params.id;

    var orderShippedQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    if (orderShippedQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='3' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been shipped and updated information DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order delivered
module.exports.deliveredOrderCust = async (req, res) => {
  try {
    // status = 4 means order is delivered
    var { id } = req.user;
    let order_id = req.params.order_id;
    //let product_id = req.params.id;

    var orderDeliverQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    if (orderDeliverQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='4' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message:
          "Order has been delivered successfully and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order cancelled
module.exports.cancelledOrderCust = async (req, res) => {
  try {
    // status = 6 means order is cancelled
    var { id } = req.user;
    let order_id = req.params.order_id;
    //let product_id = req.params.id;

    var orderCancelQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    if (orderCancelQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='6' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message:
          "Order has been cancelled successfully and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//order cancelled
module.exports.failedOrderCust = async (req, res) => {
  try {
    // status = 7 means order is cancelled
    var { id } = req.user;
    let order_id = req.params.order_id;
    //let product_id = req.params.id;

    var orderFailQuery = await ConnectionUtil(
      `select * from ordercustomers where id='${id}' and order_id='${order_id}'`
    );
    if (orderFailQuery.id != 0) {
      let providing = await ConnectionUtil(
        `update ordercustomers set 
        orderStatus='7' where order_id='${order_id}'`
      );
      res.status(200).json({
        error: 0,
        success: true,
        message: "Order has been Failed and updated information in DB properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----read order customer
module.exports.readOrderCust = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user.id;
    var userShow = await ConnectionUtil(
      `select * from ordercustomers where id='${id}'`
    );
    if (userShow == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        error: 0,
        message: "Display order customer details",
        data: userShow,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//---delete orders
module.exports.deleteOrderCust = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkOrderCust = await ConnectionUtil(
      `select * from ordercustomers where id='${id}'`
    );
    if (checkOrderCust != "") {
      let deleteOrderCustQuery = await ConnectionUtil(
        `delete from ordercustomers where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Order Customer Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//----------------------QR Code
module.exports.qrCode = async (req, res) => {
  try {
    let data = ({ storeLink, businessName, businessCategory, number, address } =
      req.body);

    var { id } = req.user;

    // Converting the data into String format
    let stringData = JSON.stringify(data);

    // Print the QR code to terminal
    QRCode.toString(
      stringData,
      {
        type: "terminal",
      },
      function (err, QRcode) {
        if (err) return console.log("error occurred");
        res.status(200).json({
          status: 200,
          success: true,
          data: QRCode,
          message: "QRCode Showed",
        });

        // Printing the generated code
        console.log(QRcode);
      }
    );

    // Converting the data into base64
    QRCode.toDataURL(stringData, function (err, code) {
      if (err) return console.log("error occurred");

      // Printing the code
      console.log(code);
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//-------------coupons
//creating coupon
module.exports.createCoupon = async (req, res) => {
  try {
    var {
      couponCode,
      usesPerUser,
      discountType,
      percent,
      minimumOrderAmount,
      maximumDiscount,
    } = req.body;

    var user_id = req.user.id;
    console.log(user_id, "#####");

    let userObj = {
      user_id: user_id,
      couponCode: couponCode,
      couponUses_per_user: usesPerUser,
      discountType: discountType,
      percent: percent,
      minimumOrderAmount: minimumOrderAmount,
      maximumDiscount: maximumDiscount,
    };
    var couponInsertQuery = await ConnectionUtil(
      `insert into coupons set ?`,
      userObj
    );
    if (couponInsertQuery != 0) {
      res.status(200).json({
        error: 0,
        success: true,
        message: "Coupon has been created properly",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----update coupon
module.exports.updateCoupon = async (req, res) => {
  try {
    var {
      couponCode,
      usesPerUser,
      discountType,
      percent,
      minimumOrderAmount,
      maximumDiscount,
    } = req.body;

    let { id } = req.params;
    var user_id = req.user.id;
    var user = await ConnectionUtil(
      `select * from coupons where user_id='${user_id}'`
    );
    if (user != "") {
      var user2 = await ConnectionUtil(
        `update coupons set 
        couponCode='${couponCode}',
        couponUses_per_user='${usesPerUser}',
        percent='${percent}',
        discountType='${discountType}',
        minimumOrderAmount='${minimumOrderAmount}',
        maximumDiscount='${maximumDiscount}' where id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " coupon has been updated successfully",
        userData: user2,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "coupon not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//----read coupons
module.exports.readCoupons = async (req, res) => {
  try {
    let { id } = req.params;
    var user_id = req.user.id;
    var userShow = await ConnectionUtil(
      `select * from coupons where id='${id}'`
    );
    if (userShow == "") {
      res.status(404).json({
        status: 404,
        success: false,
        message: "id is not valid",
      });
    } else {
      res.status(200).json({
        success: true,
        error: 0,
        message: "Display coupon details",
        data: userShow,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//--------delete coupons
module.exports.couponDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user.id;
    let checkProduct = await ConnectionUtil(
      `select * from coupons where user_id='${user_id}' and id='${id}'`
    );
    if (checkProduct != "") {
      let deleteCouponQuery = await ConnectionUtil(
        `delete from coupons where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: "Coupon Has Been Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "Id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

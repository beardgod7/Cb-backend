const repository = require("./repository");
const {
  quoteSchema,
  createOrderSchema,
  productSchema,
  updateProductSchema,
  settingsSchema,
} = require("./schema");
const { Product } = require("./model");
const { ok, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productCard(p) {
  const image = Array.isArray(p.images) && p.images.length ? p.images[0] : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    stock: p.stock,
    image,
  };
}

function productDetail(p) {
  return { ...productCard(p), description: p.description, images: p.images || [] };
}

// ===== Public =====
async function getProducts(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20 });
    const { rows, count } = await repository.listProducts({
      category: req.query.category,
      featured: req.query.featured === "true",
      offset,
      limit,
    });
    return ok(res, {
      message: "Products retrieved successfully",
      data: buildListResponse(rows.map(productCard), count, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const p = await repository.getProductBySlug(req.params.slug);
    if (!p) throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);
    return ok(res, { message: "Product retrieved successfully", data: productDetail(p) });
  } catch (err) {
    next(err);
  }
}

async function getRelatedProducts(req, res, next) {
  try {
    const p = await repository.getProductBySlug(req.params.slug);
    if (!p) throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 12);
    const related = await repository.getRelated(p, limit);
    return ok(res, { message: "Related products", data: related.map(productCard) });
  } catch (err) {
    next(err);
  }
}

// Price a cart against server prices.
async function priceCart(items, country) {
  const settings = await repository.getSettings();
  const lines = [];
  let subtotal = 0;
  let count = 0;

  for (const item of items) {
    const p = await Product.findByPk(item.productId);
    if (!p || !p.isActive) {
      throw new AppError("PRODUCT_NOT_FOUND", "Unknown or inactive product", 404, {
        data: { productId: item.productId },
      });
    }
    if (item.quantity < 1) {
      throw new AppError("INVALID_QUANTITY", "Quantity must be at least 1", 400);
    }
    const available = p.stock >= item.quantity;
    const lineTotal = p.price * item.quantity;
    subtotal += lineTotal;
    count += item.quantity;
    lines.push({
      product: p,
      productId: p.id,
      name: p.name,
      category: p.category,
      imageUrl: Array.isArray(p.images) && p.images[0] ? p.images[0].url : null,
      unitPrice: p.price,
      quantity: item.quantity,
      lineTotal,
      available,
    });
  }

  const outsideNigeria = country && country.toLowerCase() !== "nigeria";
  const deliveryFee =
    outsideNigeria && settings.deliveryFeeOutsideNigeria != null
      ? settings.deliveryFeeOutsideNigeria
      : settings.deliveryFee;
  const tax = settings.salesTax;
  const total = subtotal + tax + deliveryFee;

  return { lines, count, subtotal, tax, deliveryFee, total };
}

async function cartQuote(req, res, next) {
  try {
    const data = await quoteSchema.validateAsync(req.body);
    const priced = await priceCart(data.items, data.country);
    return ok(res, {
      message: "Cart quote",
      data: {
        items: priced.lines.map((l) => ({
          productId: l.productId,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          lineTotal: l.lineTotal,
          available: l.available,
        })),
        count: priced.count,
        subtotal: priced.subtotal,
        tax: priced.tax,
        deliveryFee: priced.deliveryFee,
        total: priced.total,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ===== Customer =====
function generateOrderNumber() {
  const rand = () => Math.floor(100 + Math.random() * 900);
  return `${rand()}-${Date.now().toString().slice(-7)}-${rand()}`;
}

async function createOrder(req, res, next) {
  try {
    const data = await createOrderSchema.validateAsync(req.body);
    const priced = await priceCart(data.items, data.delivery.country);

    // Check stock at creation time.
    for (const l of priced.lines) {
      if (!l.available) {
        throw new AppError("OUT_OF_STOCK", "A product ran out of stock", 409, {
          data: { productId: l.productId, available: l.product.stock },
        });
      }
    }

    const order = await repository.createOrder(
      {
        orderNumber: generateOrderNumber(),
        userId: req.userId,
        status: "pending_payment",
        subtotal: priced.subtotal,
        tax: priced.tax,
        deliveryFee: priced.deliveryFee,
        total: priced.total,
        delivery: data.delivery,
      },
      priced.lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        category: l.category,
        imageUrl: l.imageUrl,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      }))
    );

    return ok(res, {
      status: 201,
      message: "Order created",
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryFee: order.deliveryFee,
        total: order.total,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20 });
    const { rows, count } = await repository.listOrdersByUser({
      userId: req.userId,
      status: req.query.status,
      search: req.query.search,
      offset,
      limit,
    });
    const items = rows.map((o) => {
      const first = (o.items || [])[0];
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
        status: o.status,
        itemCount: (o.items || []).reduce((s, it) => s + it.quantity, 0),
        total: o.total,
        type: "merchandise",
        firstItem: first ? { name: first.name, imageUrl: first.imageUrl } : null,
      };
    });
    return ok(res, {
      message: "Orders retrieved successfully",
      data: buildListResponse(items, count, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await repository.getOrderById(req.params.id);
    if (!order || String(order.userId) !== String(req.userId)) {
      throw new AppError("NOT_FOUND", "Order not found", 404);
    }
    return ok(res, { message: "Order retrieved successfully", data: order });
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const order = await repository.getOrderById(req.params.id);
    if (!order || String(order.userId) !== String(req.userId)) {
      throw new AppError("NOT_FOUND", "Order not found", 404);
    }
    if (order.status !== "pending_payment") {
      throw new AppError("CANNOT_CANCEL", "Only pending orders can be cancelled", 400);
    }
    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();
    return ok(res, { message: "Order cancelled", data: { id: order.id, status: order.status } });
  } catch (err) {
    next(err);
  }
}

// ===== Admin =====
async function adminListProducts(req, res, next) {
  try {
    const products = await repository.listAllProducts();
    return ok(res, { message: "Products", data: products.map(productDetail) });
  } catch (err) {
    next(err);
  }
}

async function adminCreateProduct(req, res, next) {
  try {
    const data = await productSchema.validateAsync(req.body);
    if (!data.slug) data.slug = slugify(data.name);
    const product = await repository.createProduct(data);
    return ok(res, { status: 201, message: "Product created", data: productDetail(product) });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateProduct(req, res, next) {
  try {
    const data = await updateProductSchema.validateAsync(req.body);
    const product = await repository.updateProduct(req.params.id, data);
    if (!product) throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);
    return ok(res, { message: "Product updated", data: productDetail(product) });
  } catch (err) {
    next(err);
  }
}

async function adminAdjustStock(req, res, next) {
  try {
    const product = await repository.getProductById(req.params.id, { includeInactive: true });
    if (!product) throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);
    if (typeof req.body.stock === "number") {
      product.stock = Math.max(0, req.body.stock);
    } else if (typeof req.body.adjust === "number") {
      product.stock = Math.max(0, product.stock + req.body.adjust);
    } else {
      throw new AppError("BAD_REQUEST", "Provide stock or adjust", 400);
    }
    await product.save();
    return ok(res, { message: "Stock updated", data: { id: product.id, stock: product.stock } });
  } catch (err) {
    next(err);
  }
}

async function adminDeleteProduct(req, res, next) {
  try {
    const okDel = await repository.softDeleteProduct(req.params.id);
    if (!okDel) throw new AppError("PRODUCT_NOT_FOUND", "Product not found", 404);
    return ok(res, { message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

async function adminListOrders(req, res, next) {
  try {
    const orders = await repository.listOrdersAdmin({
      status: req.query.status,
      search: req.query.search,
      from: req.query.from,
      to: req.query.to,
    });
    return ok(res, { message: "Orders", data: orders });
  } catch (err) {
    next(err);
  }
}

const { sendMail } = require("../../service/emailservice");

async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    const allowed = ["dispatched", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      throw new AppError("BAD_REQUEST", `status must be one of ${allowed.join(", ")}`, 400);
    }
    const order = await repository.getOrderById(req.params.id);
    if (!order) throw new AppError("NOT_FOUND", "Order not found", 404);
    order.status = status;
    if (status === "dispatched") order.dispatchedAt = new Date();
    if (status === "delivered") order.deliveredAt = new Date();
    if (status === "cancelled") order.cancelledAt = new Date();
    await order.save();

    try {
      await sendMail({
        to: order.delivery?.email,
        subject: `Your CBAAC order ${order.orderNumber} is now ${status}`,
        html: `<p>Your order <strong>${order.orderNumber}</strong> is now <strong>${status}</strong>.</p>${
          note ? `<p>${note}</p>` : ""
        }`,
      });
    } catch (_) {}

    return ok(res, { message: "Order status updated", data: { id: order.id, status } });
  } catch (err) {
    next(err);
  }
}

async function adminExportOrders(req, res, next) {
  try {
    const orders = await repository.listOrdersAdmin({ from: req.query.from, to: req.query.to });
    const header = "orderNumber,status,total,createdAt,email\n";
    const body = orders
      .map((o) =>
        [o.orderNumber, o.status, o.total, o.createdAt?.toISOString() || "", o.delivery?.email || ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="orders.csv"');
    return res.send(header + body);
  } catch (err) {
    next(err);
  }
}

async function adminGetSettings(req, res, next) {
  try {
    const s = await repository.getSettings();
    return ok(res, { message: "Shop settings", data: s });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateSettings(req, res, next) {
  try {
    const data = await settingsSchema.validateAsync(req.body);
    const s = await repository.updateSettings(data);
    return ok(res, { message: "Shop settings updated", data: s });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProduct,
  getRelatedProducts,
  cartQuote,
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminAdjustStock,
  adminDeleteProduct,
  adminListOrders,
  adminUpdateOrderStatus,
  adminExportOrders,
  adminGetSettings,
  adminUpdateSettings,
};

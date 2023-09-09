import { objectType, extendType, nonNull, stringArg, floatArg } from "nexus";

import { NexusGenObjects } from "../../nexus.typegen";

import sockerServer from "../../index";

export const ProductType = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.float("price");
  },
});

// create product list
let products: NexusGenObjects["Product"][] = [
  {
    id: 1,
    name: " Product 1",
    price: 21.25,
  },
  {
    id: 2,
    name: " Product 2",
    price: 21.25,
  },
];

export const ProductsQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("products", {
      type: "Product",
      resolve(_parent, _args, _context, _info) {
        sockerServer.generateNotification("1234567", "product lists");
        return products;
      },
    });
  },
});

export const createProductMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProduct", {
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        price: nonNull(floatArg()),
      },
      resolve(_parent, args, _context, _info) {
        const { name, price } = args;
        const product = {
          id: products.length + 1,
          name,
          price,
        };
        sockerServer.generateNotification(
          "1234567",
          "product created successfully"
        );
        products.push(product);
        return product;
      },
    });
  },
});

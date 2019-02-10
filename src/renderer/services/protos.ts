import * as protoLoader from "@grpc/proto-loader";

import { PackageDefinition } from "@grpc/grpc-js/build/src/make-client";
import { IProto } from "../types/protos";

/**
 * Validate a proto file
 */
export const validateProto = (proto: IProto): Promise<PackageDefinition> => {
  return new Promise((resolve, reject) => {
    const options = {};
    try {
      const pkgDef = protoLoader.loadSync(proto.path, options);
      resolve(pkgDef);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Return a human friendly proto name
 */
export const humanFriendlyProtoName = (proto: IProto): string =>
  proto.name.replace(".proto", "");

import initialState from "./projects.state";
import { ADD_PROTO_TO_PROJECT, NEW_PROJECT } from "./projects.types";

import { IReduxAction } from "../../types";
import { IProject } from "../../types/projects";
import { IProto } from "../../types/protos";

const projectsReducer = (
  state: IProject = initialState,
  { payload, type }: IReduxAction
): IProject => {
  switch (type) {
    case ADD_PROTO_TO_PROJECT:
      const payloadProto = payload as IProto;

      let protos: Array<IProto> = [];
      const existsAlready = state.protos.find(
        proto => proto.path === payloadProto.path
      );

      if (existsAlready) {
        protos = Array.from(state.protos);
      } else {
        protos = [...state.protos, payloadProto];
      }

      return {
        ...state,
        protos
      };

    case NEW_PROJECT:
      return state;

    default:
      return state;
  }
};

export default projectsReducer;

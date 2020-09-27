import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import ContextualDelete from "../components/ContextualDelete";
import {
  updateContextualDelete,
  getSelectedNode,
  markNodeReadyToDelete,
} from "../store";

const ContextualDeleteContainer = (props) => {
  const state = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const handleOnMouseLeave = useCallback(() => {
    dispatch(updateContextualDelete({ isActive: false }));
  }, [dispatch]);

  const { name, type } = state.selectedNode || {};
  const handleOnClick = useCallback(() => {
    dispatch(updateContextualDelete({ isActive: false }));
    // Avoid recursive when is a relation node.
    dispatch(markNodeReadyToDelete({ name, recursive: type !== "relation" }));
  }, [name, type, dispatch]);

  const { isActive } = state;

  useEffect(() => {
    isActive
      ? (document.body.style.cursor = "pointer")
      : (document.body.style.cursor = "default");

    return () => (document.body.style.cursor = "default");
  }, [isActive]);

  if (!state.isActive) return null;

  return (
    <ContextualDelete
      {...props}
      {...state}
      handleOnMouseLeave={handleOnMouseLeave}
      handleOnClick={handleOnClick}
    />
  );
};

const mapStateToProps = ({ contextualDelete, nodes }) => {
  return {
    ...contextualDelete,
    selectedNode: getSelectedNode(nodes),
  };
};

export default ContextualDeleteContainer;

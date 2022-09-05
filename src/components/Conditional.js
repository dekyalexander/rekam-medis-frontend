const Conditional = (props) => {
  if (props.condition === true) {
    return <>{props.children}</>;
  }
  return null;
};

export default Conditional;

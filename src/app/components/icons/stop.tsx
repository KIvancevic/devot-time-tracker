interface stopIcon {
  color?: string;
  className?: string;
}

const stopIcon: React.FC<stopIcon> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
    className={props.className}
  >
    <path
      fill={props.color ? props.color : "#5F6B8A"}
      d="M12 21.84A9.84 9.84 0 1 1 21.84 12 9.858 9.858 0 0 1 12 21.84Zm0-18.743A8.903 8.903 0 1 0 20.903 12 8.919 8.919 0 0 0 12 3.097Z"
    />
    <path
      fill={props.color ? props.color : "#5F6B8A"}
      d="M14.823 8.472H9.175a.703.703 0 0 0-.703.703v5.648c0 .388.314.703.703.703h5.648a.703.703 0 0 0 .703-.703V9.175a.703.703 0 0 0-.703-.703Z"
    />
  </svg>
);
export default stopIcon;

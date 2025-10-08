const CELLogo = ({
  className,
  colorVariant,
}: {
  className?: string;
  colorVariant?: "original" | "grayscale" | "accent";
}) => {
  let colorStyle =
    "data-[style=s1]:fill-muted-foreground data-[style=s2]:fill-accent-foreground";
  if (colorVariant === "original")
    colorStyle =
      "data-[style=s1]:fill-[#958CC1] data-[style=s2]:fill-[#674049]";
  if (colorVariant === "accent")
    colorStyle = "data-[style=s1]:fill-primary/75 data-[style=s2]:fill-primary";

  return (
    <svg
      version="1.0"
      x="0px"
      y="0px"
      viewBox="0 0 119.9 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="3rem"
      height="1.5rem"
    >
      <g>
        <g>
          <g>
            <path
              data-style="s1"
              className={colorStyle}
              d="M60.1,40.3c-0.1,0-0.2,0-0.2,0c-1.8,0-3.5-0.5-4.9-1.4v0l-1-0.7c-2.2-1.4-4.6-2.4-7-3
				c-0.6,4-2.2,7.7-4.7,10.9c4.2,4.9,10.5,8.1,17.5,8.1c9.5,0,17.7-5.7,21.2-13.9L60.1,40.3L60.1,40.3z"
            />
            <path
              data-style="s1"
              className={colorStyle}
              d="M59.8,8.9c-7,0-13.3,3.1-17.5,8.1c2.5,3.2,4.1,7,4.7,11c2.5-0.6,5-1.7,7.3-3.2l0.5-0.3
				c1.4-1,3.2-1.6,5.1-1.6c4.7,0,8.6,3.7,8.8,8.3h0v0.2c0,0.1,0,0.1,0,0.2s0,0.1,0,0.2v2.1h14c0.1-0.8,0.1-1.5,0.1-2.3
				C82.8,19.1,72.5,8.9,59.8,8.9z"
            />
          </g>
        </g>
        <path
          data-style="s2"
          className={colorStyle}
          d="M98.7,54.2c9.5,0,17.7-5.7,21.2-13.9H99v0c0,0,0,0,0,0c-4.7,0-8.6-3.7-8.8-8.3h0v-0.1c0-0.1,0-0.2,0-0.3
		c0-0.1,0-0.2,0-0.3V10.6c-3.9,1.6-7.3,4.2-9.8,7.5c2.7,4,4.2,8.6,4.2,13.5c0,0.8,0,1.6-0.1,2.4l-0.1,1.4h-1.4h-6.7
		c0.2,1.2,0.5,2.3,0.9,3.4h4.2h2.3l-0.9,2.1c-0.6,1.5-1.4,2.9-2.3,4.2C84.5,50.6,91.2,54.2,98.7,54.2z"
        />
        <path
          data-style="s2"
          className={colorStyle}
          d="M23,22.9c1.8,0,3.5,0.5,4.9,1.5v0l1,0.7c5.2,3.2,11.1,4.3,16.8,3.3C44.1,17.3,34.5,8.9,23,8.9
		C10.3,8.9,0,19.1,0,31.6S10.3,54.2,23,54.2c11.5,0,21.1-8.4,22.7-19.3c-5.8-1.1-11.8,0.1-17.1,3.5l-0.7,0.5v0
		c-1.4,0.9-3.1,1.5-4.9,1.5c-4.9,0-8.8-3.9-8.8-8.7S18.1,22.9,23,22.9z"
        />
      </g>
    </svg>
  );
};

export default CELLogo;

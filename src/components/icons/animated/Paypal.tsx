export function Paypal({ show }: { show: boolean }) {
  return (
    <>
      {/*?xml version="1.0" encoding="iso-8859-1"?*/}
      {/* Generator: Adobe Illustrator 23.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  */}
      <svg
        version="1.1"
        id="paypal-svg"
        className={
          "absolute left-1/2 -translate-x-[7ch] " + (!show ? "active" : "")
        }
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 48 48"
        // @ts-ignore
        style={{ enableBackground: "new 0 0 48 48" }}
        xmlSpace="preserve"
        width={28}
        height={28}
      >
        <path
          style={{
            fill: "none",
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
          d="M9.446,16.767L5.779,34.173
	C5.635,34.858,6.156,35.5,6.855,35.5h8.099"
          className="svg-elem-1"
        />
        <path
          style={{
            fill: "none",
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
          d="M24.23,24
	c4.826,0,8.998-3.367,10.018-8.084l0.163-0.754c1.074-4.97-2.712-9.663-7.797-9.663h-5.341H17.82h-4.979
	c-0.595,0-1.109,0.417-1.232,0.999l-1.168,5.547"
          className="svg-elem-2"
        />
        <path
          style={{
            fill: "none",
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
          d="M23.608,37.241L24.923,31
	h7.307c4.826,0,8.998-3.367,10.018-8.084l0.163-0.754c1.074-4.969-2.712-9.662-7.797-9.662"
          className="svg-elem-3"
        />
        <path
          style={{
            fill: "none",
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
          d="M34.614,12.5H19.82
	l-6.041,28.674c-0.144,0.683,0.377,1.326,1.075,1.326H22.5"
          className="svg-elem-4"
        />
      </svg>
    </>
  );
}

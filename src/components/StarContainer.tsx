import React, { useEffect, useRef } from "react";

const StarContainer = React.forwardRef<
  HTMLDivElement,
  {
    particles: { target: HTMLDivElement; visible: boolean }[];
    reGenerateOpacity?: boolean;
    root?: HTMLElement | null;
  }
>(({ particles, reGenerateOpacity, root }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const _containerRef = ref && typeof ref !== "function" ? ref : containerRef;
  useEffect(() => {
    if (!reGenerateOpacity) {
      return;
    }
    particles?.forEach((dot) => {
      dot.target?.style.setProperty("opacity", Math.random().toString());
    });
  }, [reGenerateOpacity]);

  useEffect(() => {
    const container = _containerRef.current;
    if (!container) {
      return;
    }
    const visibleParticles = particles.filter((part) => part.visible);
    const animate = (id?: NodeJS.Timeout) => {
      if (id) {
        clearTimeout(id);
      }
      const numberOfParticles = Math.floor(Math.random() * 5 + 3);
      for (let i = 0; i <= numberOfParticles; i++) {
        const target =
          visibleParticles[
            Math.floor(Math.random() * visibleParticles.length - 1)
          ]?.target;
        if (!target) {
          continue;
        }
        const opacity = parseFloat(
          getComputedStyle(target).getPropertyValue("opacity")
        );
        const toVisible = [
          opacity.toString(),
          opacity < 0.5 ? "1" : (Math.random() * (opacity || 1)).toString(),
          "1",
        ];
        const toHide = [
          opacity.toString(),
          opacity < 0.5 ? "1" : (Math.random() * opacity).toString(),
          "1",
          "1",
          (Math.random() * opacity).toString(),
          "0",
        ];
        const types = [toVisible, toHide];
        const index = Math.floor(Math.random() - 0.1);
        const type = types[index];
        requestAnimationFrame(() => {
          // if (i === numberOfParticles - 1) {
          //   console.log(performance.now());
          // }
          const animation = target.animate(
            {
              opacity: type,
            },
            {
              duration: 1000,
              fill: "forwards",
              delay: index * 100,
            }
          );
          animation.commitStyles();
          if (i === numberOfParticles - 1) {
            // animation.onfinish = () => {
            // console.log(performance.now())
            // animate();
            //   animation.cancel();
            // };
            const totalDelay = Array(numberOfParticles)
              .fill(undefined)
              .reduce((acc, _) => {
                return acc + 1000;
              }, 0);
            // console.log({ totalDelay });
            const id = setTimeout(() => {
              animate(id);
            }, totalDelay);
          }
        });
      }
    };

    animate();
  }, [particles]);

  return (
    <div
      ref={ref || containerRef}
      className="particle-container absolute w-[110%] h-[150%] -top-[25%]"
    >
      <div
        className="dot [--opacity:0.687303]"
        style={{
          left: "156.917px",
          top: "64.1642px",
          width: "1.82928px",
          height: "1.82928px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.967279]"
        style={{
          left: "54.0749px",
          top: "27.1623px",
          width: "1.50034px",
          height: "1.50034px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.243683]"
        style={{
          left: "223.009px",
          top: "61.6993px",
          width: "2.07088px",
          height: "2.07088px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.212625]"
        style={{
          left: "111.999px",
          top: "24.1887px",
          width: "2.1627px",
          height: "2.1627px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.610214]"
        style={{
          left: "45.9424px",
          top: "74.149px",
          width: "1.94843px",
          height: "1.94843px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.126006]"
        style={{
          left: "251.708px",
          top: "10.2414px",
          width: "1.97548px",
          height: "1.97548px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.259321]"
        style={{
          left: "146.931px",
          top: "16.6548px",
          width: "2.06846px",
          height: "2.06846px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.460942]"
        style={{
          left: "355.463px",
          top: "9.12012px",
          width: "2.29896px",
          height: "2.29896px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.141112]"
        style={{
          left: "32.7979px",
          top: "2.73635px",
          width: "2.28261px",
          height: "2.28261px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.108232]"
        style={{
          left: "39.0654px",
          top: "87.33px",
          width: "1.85452px",
          height: "1.85452px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.838755]"
        style={{
          left: "170.302px",
          top: "56.9152px",
          width: "1.04616px",
          height: "1.04616px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.472288]"
        style={{
          left: "32.9544px",
          top: "39.4983px",
          width: "1.18434px",
          height: "1.18434px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.256874]"
        style={{
          left: "256.946px",
          top: "25.7312px",
          width: "1.83865px",
          height: "1.83865px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.325479]"
        style={{
          left: "172.906px",
          top: "69.5425px",
          width: "2.13106px",
          height: "2.13106px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.00116063]"
        style={{
          left: "308.041px",
          top: "89.4557px",
          width: "2.69126px",
          height: "2.69126px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.39451]"
        style={{
          left: "281.782px",
          top: "39.1301px",
          width: "1.95351px",
          height: "1.95351px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.209166]"
        style={{
          left: "328.348px",
          top: "0.87666px",
          width: "1.71415px",
          height: "1.71415px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.083749]"
        style={{
          left: "305.514px",
          top: "52.563px",
          width: "1.77967px",
          height: "1.77967px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.368583]"
        style={{
          left: "104.422px",
          top: "11.9865px",
          width: "1.13637px",
          height: "1.13637px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.336968]"
        style={{
          left: "335.563px",
          top: "64.9383px",
          width: "1.15753px",
          height: "1.15753px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.478781]"
        style={{
          left: "334.788px",
          top: "33.6048px",
          width: "1.54997px",
          height: "1.54997px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.182055]"
        style={{
          left: "210.649px",
          top: "12.9842px",
          width: "2.20358px",
          height: "2.20358px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.791973]"
        style={{
          left: "72.9345px",
          top: "71.503px",
          width: "1.9898px",
          height: "1.9898px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.0644034]"
        style={{
          left: "304.917px",
          top: "12.7497px",
          width: "1.22242px",
          height: "1.22242px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.328043]"
        style={{
          left: "161.571px",
          top: "53.9249px",
          width: "2.91041px",
          height: "2.91041px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.914932]"
        style={{
          left: "92.0543px",
          top: "82.4488px",
          width: "2.81953px",
          height: "2.81953px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.234731]"
        style={{
          left: "280.415px",
          top: "69.7728px",
          width: "1.22501px",
          height: "1.22501px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.339797]"
        style={{
          left: "92.2041px",
          top: "53.8064px",
          width: "1.51559px",
          height: "1.51559px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.659097]"
        style={{
          left: "74.8683px",
          top: "48.0159px",
          width: "1.9424px",
          height: "1.9424px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.824101]"
        style={{
          left: "190.218px",
          top: "21.9767px",
          width: "1.09301px",
          height: "1.09301px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.643666]"
        style={{
          left: "235.121px",
          top: "60.8364px",
          width: "1.59242px",
          height: "1.59242px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.182786]"
        style={{
          left: "104.328px",
          top: "32.3227px",
          width: "1.59387px",
          height: "1.59387px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.63064]"
        style={{
          left: "258.277px",
          top: "80.2917px",
          width: "1.27812px",
          height: "1.27812px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.495075]"
        style={{
          left: "238.384px",
          top: "76.0789px",
          width: "2.38372px",
          height: "2.38372px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.215357]"
        style={{
          left: "356.721px",
          top: "80.1183px",
          width: "1.15374px",
          height: "1.15374px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.958562]"
        style={{
          left: "122.451px",
          top: "22.9113px",
          width: "2.1056px",
          height: "2.1056px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.072087]"
        style={{
          left: "202.24px",
          top: "23.5904px",
          width: "2.80661px",
          height: "2.80661px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.617747]"
        style={{
          left: "224.069px",
          top: "73.2705px",
          width: "2.25682px",
          height: "2.25682px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.183796]"
        style={{
          left: "23.9783px",
          top: "13.0356px",
          width: "2.01257px",
          height: "2.01257px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.190566]"
        style={{
          left: "212.803px",
          top: "82.1598px",
          width: "1.7923px",
          height: "1.7923px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.215692]"
        style={{
          left: "333.926px",
          top: "13.6945px",
          width: "1.30431px",
          height: "1.30431px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.817822]"
        style={{
          left: "118.384px",
          top: "72.7926px",
          width: "1.72436px",
          height: "1.72436px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.33377]"
        style={{
          left: "76.3845px",
          top: "12.7208px",
          width: "1.64464px",
          height: "1.64464px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.935979]"
        style={{
          left: "228.123px",
          top: "15.6064px",
          width: "2.17917px",
          height: "2.17917px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.883293]"
        style={{
          left: "203.769px",
          top: "35.1554px",
          width: "2.25112px",
          height: "2.25112px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.198273]"
        style={{
          left: "306.801px",
          top: "38.5708px",
          width: "1.14082px",
          height: "1.14082px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.111169]"
        style={{
          left: "291.104px",
          top: "18.0712px",
          width: "1.66339px",
          height: "1.66339px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.505943]"
        style={{
          left: "367.841px",
          top: "4.68855px",
          width: "2.83222px",
          height: "2.83222px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.309867]"
        style={{
          left: "54.2005px",
          top: "86.7251px",
          width: "2.02528px",
          height: "2.02528px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.00927374]"
        style={{
          left: "232.002px",
          top: "85.5545px",
          width: "1.54832px",
          height: "1.54832px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.660095]"
        style={{
          left: "116.844px",
          top: "0.446678px",
          width: "1.87887px",
          height: "1.87887px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.406358]"
        style={{
          left: "314.976px",
          top: "30.2313px",
          width: "1.47921px",
          height: "1.47921px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.122226]"
        style={{
          left: "96.999px",
          top: "27.7915px",
          width: "1.16194px",
          height: "1.16194px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.0727727]"
        style={{
          left: "98.2157px",
          top: "60.178px",
          width: "1.57781px",
          height: "1.57781px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.69621]"
        style={{
          left: "150.638px",
          top: "52.7117px",
          width: "2.2846px",
          height: "2.2846px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.42937]"
        style={{
          left: "67.4187px",
          top: "59.0522px",
          width: "2.99435px",
          height: "2.99435px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.162677]"
        style={{
          left: "108.98px",
          top: "77.48px",
          width: "1.95827px",
          height: "1.95827px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.760597]"
        style={{
          left: "348.207px",
          top: "47.8748px",
          width: "2.64606px",
          height: "2.64606px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.0168046]"
        style={{
          left: "146.26px",
          top: "64.5626px",
          width: "2.78762px",
          height: "2.78762px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.853453]"
        style={{
          left: "126.427px",
          top: "9.69847px",
          width: "1.04691px",
          height: "1.04691px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.472477]"
        style={{
          left: "308.603px",
          top: "4.82688px",
          width: "1.24998px",
          height: "1.24998px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.126519]"
        style={{
          left: "325.69px",
          top: "80.7892px",
          width: "1.38755px",
          height: "1.38755px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.0492658]"
        style={{
          left: "346.945px",
          top: "61.7414px",
          width: "2.45942px",
          height: "2.45942px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.771701]"
        style={{
          left: "265.175px",
          top: "8.71698px",
          width: "1.04347px",
          height: "1.04347px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.975819]"
        style={{
          left: "174.259px",
          top: "47.8657px",
          width: "1.12189px",
          height: "1.12189px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.933522]"
        style={{
          left: "255.694px",
          top: "38.7479px",
          width: "1.46036px",
          height: "1.46036px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.0184999]"
        style={{
          left: "20.3719px",
          top: "47.4069px",
          width: "1.66925px",
          height: "1.66925px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.00769698]"
        style={{
          left: "314.908px",
          top: "60.908px",
          width: "2.55859px",
          height: "2.55859px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.662705]"
        style={{
          left: "11.9873px",
          top: "19.8437px",
          width: "1.71158px",
          height: "1.71158px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.863459]"
        style={{
          left: "132.578px",
          top: "67.4738px",
          width: "2.81373px",
          height: "2.81373px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.175117]"
        style={{
          left: "230.091px",
          top: "44.35px",
          width: "2.06487px",
          height: "2.06487px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.141807]"
        style={{
          left: "234.535px",
          top: "8.73457px",
          width: "1.3474px",
          height: "1.3474px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.367238]"
        style={{
          left: "195.814px",
          top: "49.7945px",
          width: "1.96669px",
          height: "1.96669px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.270473]"
        style={{
          left: "20.9582px",
          top: "4.01434px",
          width: "1.7696px",
          height: "1.7696px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.938449]"
        style={{
          left: "183.861px",
          top: "14.3215px",
          width: "1.26752px",
          height: "1.26752px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.13605]"
        style={{
          left: "120.072px",
          top: "60.431px",
          width: "2.50117px",
          height: "2.50117px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.122371]"
        style={{
          left: "291.812px",
          top: "63.8133px",
          width: "1.06534px",
          height: "1.06534px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.715798]"
        style={{
          left: "222.075px",
          top: "50.0806px",
          width: "2.13161px",
          height: "2.13161px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.878365]"
        style={{
          left: "259.553px",
          top: "69.9346px",
          width: "1.74698px",
          height: "1.74698px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.312117]"
        style={{
          left: "151.118px",
          top: "34.048px",
          width: "2.57236px",
          height: "2.57236px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.08453]"
        style={{
          left: "175.507px",
          top: "22.4185px",
          width: "1.54558px",
          height: "1.54558px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.214046]"
        style={{
          left: "237.405px",
          top: "29.5298px",
          width: "2.65393px",
          height: "2.65393px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.00769962]"
        style={{
          left: "198.954px",
          top: "81.2452px",
          width: "2.08757px",
          height: "2.08757px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.873216]"
        style={{
          left: "11.6614px",
          top: "31.7241px",
          width: "2.29235px",
          height: "2.29235px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.766361]"
        style={{
          left: "31.8829px",
          top: "26.6201px",
          width: "2.03987px",
          height: "2.03987px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.672601]"
        style={{
          left: "346.607px",
          top: "3.4394px",
          width: "2.49068px",
          height: "2.49068px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.656904]"
        style={{
          left: "281.521px",
          top: "8.31521px",
          width: "2.13295px",
          height: "2.13295px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.931943]"
        style={{
          left: "23.5178px",
          top: "73.8214px",
          width: "2.72072px",
          height: "2.72072px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.355145]"
        style={{
          left: "195.11px",
          top: "4.01305px",
          width: "2.6117px",
          height: "2.6117px",
        }}
      ></div>
      <div
        className="dot [--opacity:1.22152px]"
        style={{
          left: "51.2165px",
          top: "47.7033px",
          width: "1.22152px",
          height: "",
        }}
      ></div>
      <div
        className="dot [--opacity:0.921512]"
        style={{
          left: "295.473px",
          top: "1.58568px",
          width: "1.93958px",
          height: "1.93958px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.948286]"
        style={{
          left: "143.553px",
          top: "26.3161px",
          width: "2.53452px",
          height: "2.53452px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.144403]"
        style={{
          left: "299.431px",
          top: "75.4352px",
          width: "1.81774px",
          height: "1.81774px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.679264]"
        style={{
          left: "20.6513px",
          top: "29.108px",
          width: "1.33652px",
          height: "1.33652px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.975496]"
        style={{
          left: "156.722px",
          top: "0.820877px",
          width: "1.23569px",
          height: "1.23569px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.836794]"
        style={{
          left: "128.313px",
          top: "51.8146px",
          width: "1.04553px",
          height: "1.04553px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.568164]"
        style={{
          left: "324.787px",
          top: "71.9644px",
          width: "1.45033px",
          height: "1.45033px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.899702]"
        style={{
          left: "343.958px",
          top: "86.2446px",
          width: "1.05935px",
          height: "1.05935px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.707425]"
        style={{
          left: "117.654px",
          top: "31.5269px",
          width: "1.29411px",
          height: "1.29411px",
        }}
      ></div>
      <div
        className="dot [--opacity:0.160227]"
        style={{
          left: "318.247px",
          top: "18.4193px",
          width: "2.0642px",
          height: "2.0642px",
        }}
      ></div>
    </div>
  );
});

export default React.memo(StarContainer);

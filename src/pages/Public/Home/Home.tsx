import CommonWrapper from "@/common/CommonWrapper";
import Banner from "./Components/Banner";
import Product from "./Components/Product";
import M4Mask from "./Components/M4Mask";
import PerformanceCollage from "./Components/PerformanceCollage";

const Home = () => {
  return (
    <div className="">

    <CommonWrapper>
      <Banner />
      <Product />
    </CommonWrapper>
      <M4Mask />
      <PerformanceCollage />
    </div>
  );
};

export default Home;

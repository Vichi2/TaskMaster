import Navbar from "../../components/common/Navbar";
import Tasks from "../../components/common/Tasks";

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Tasks />
    </div>
  );
};

export default HomePage;

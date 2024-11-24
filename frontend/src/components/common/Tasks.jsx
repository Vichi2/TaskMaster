import { useQuery } from "@tanstack/react-query";
import Task from "./Task";

const Tasks = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const username = authUser.username;
  const { data: posts, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/tasks/user/${username}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return (
    <>
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No Tasks</p>
      )}
      {!isLoading && posts && (
        <div className="flex flex-wrap justify-start gap-4 mt-8">
          {posts.map((post) => (
            <Task key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Tasks;

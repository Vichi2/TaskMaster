import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Task = ({ post }) => {
  // const taskOwner = post.user;
  const queryClient = useQueryClient();

  const [text, setText] = useState("");

  // update post
  const { mutate: updateTask } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/tasks/update/${post._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      // reset the form state
      setText("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // delete function
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/tasks/delete/${post._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // refetch the posts
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDeleteTask = () => {
    deletePost();
  };

  const handleUpdateTask = () => {
    updateTask();
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div className="card bg-pink-500 shadow-lg flex-grow max-w-xs sm:max-w-sm md:max-w-md">
      <div className="card-body">
        <p>{post.text}</p>

        <div className="card-actions">
          <FaTrash
            className="mt-auto cursor-pointer"
            onClick={handleDeleteTask}
          />

          <FaPencilAlt
            className="ml-auto"
            onClick={() => document.getElementById(post._id).showModal()}
          />
          <dialog id={post._id} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-center mb-3">
                Update Task
              </h3>
              <input
                type="text"
                placeholder="create new task"
                className="input input-bordered w-full max-w-sm"
                onChange={handleInputChange}
                value={text}
              />

              <form method="dialog" className="mt-3">
                <button className="btn btn-success" onClick={handleUpdateTask}>
                  <FaPencilAlt className="ml-3" onClick={handleUpdateTask} />
                </button>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Task;

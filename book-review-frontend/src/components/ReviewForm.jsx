import { useForm } from "react-hook-form";

export default function ReviewForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="space-y-4">
      <textarea {...register("comment")} className="w-full p-2 border rounded" placeholder="Write your review" required />
      <input type="number" {...register("rating")} min="1" max="5" className="w-full p-2 border rounded" placeholder="Rating (1-5)" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
    </form>
  );
}

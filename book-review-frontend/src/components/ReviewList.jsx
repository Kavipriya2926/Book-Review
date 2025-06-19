export default function ReviewList({ reviews }) {
  if (!reviews?.length) return <p className="text-gray-500">No reviews yet.</p>;

  return (
    <div className="mt-6 space-y-4">
      {reviews.map((rev) => (
        <div key={rev._id} className="border p-3 rounded bg-white shadow">
          <p className="font-semibold">{rev.user?.name || "Anonymous"}</p>
          <p className="text-sm text-yellow-600">Rating: {rev.rating} ⭐</p>
          <p>{rev.comment}</p>
        </div>
      ))}
    </div>
  );
}

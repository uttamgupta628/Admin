import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ratings = [
  { user: 'Alice', rating: 5, comment: 'Amazing service!' },
  {
    user: 'Bob',
    rating: 4,
    comment: 'Great experience but needs improvements.',
  },
  { user: 'Charlie', rating: 3, comment: 'Average service.' },
];

export default function AppRatingsFeedback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Ratings & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {ratings.map((feedback, index) => (
          <div key={index} className="mb-4 border-b pb-2">
            <h3 className="font-bold">{feedback.user}</h3>
            <p>⭐ {feedback.rating}/5</p>
            <p className="text-gray-500">{feedback.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

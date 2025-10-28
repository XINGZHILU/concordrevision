'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { askQuestion } from '@/lib/chatbot/actions';
import MDViewer from '@/lib/customui/Basic/showMD';


export default function Chat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (error) {
      console.error(error);
      setAnswer('An error occurred while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl py-24 flex flex-col stretch gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question about academic subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here"
              disabled={loading}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Asking...' : 'Ask'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <p className="text-center">Getting answer...</p>}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <MDViewer content={answer} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

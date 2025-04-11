import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscribers, unsubscribeEmail, sendNewsletter } from '@/lib/store/features/newsletter/newsletterSlice';
import NewsletterFilter from '@/components/admin/newsletterFilter';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import Pagination from '@/components/shop/pagination';

export default function NewsletterManagement() {
  const dispatch = useDispatch();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { subscribers, loading, sending, result } = useSelector((state) => state.newsletter);

  const filteredSubscribers = useMemo(() => {
    if (!searchQuery.trim()) return subscribers;
    return subscribers.filter(subscriber =>
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subscribers, searchQuery]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

  const handleUnsubscribe = (email) => {
    dispatch(unsubscribeEmail(email));
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    const resultAction = await dispatch(sendNewsletter({ subject, content }));
    if (sendNewsletter.fulfilled.match(resultAction)) {
      setSubject('');
      setContent('');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendNewsletter} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Newsletter Subject"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content (HTML supported)
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your newsletter content here..."
                className="min-h-[200px]"
                required
              />
            </div>
            <Button type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send Newsletter'}
            </Button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Sending Results:</h3>
              <ul className="space-y-1 text-sm">
                <li>Total Subscribers: {result.totalSubscribers}</li>
                <li className="text-green-600">Successfully Sent: {result.successCount}</li>
                {result.errorCount > 0 && (
                  <li className="text-red-600">Failed: {result.errorCount}</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : subscribers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No subscribers found</p>
          ) : filteredSubscribers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No subscribers found matching search criteria</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((subscriber) => (
                      <TableRow key={subscriber.email}>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${subscriber.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUnsubscribe(subscriber.email)}
                            disabled={!subscriber.isSubscribed}
                          >
                            Unsubscribe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredSubscribers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
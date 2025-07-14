import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  pin: z.string().length(6, 'OTP must be exactly 6 digits.'),
});

export function VerifyOTP() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    console.log(data);

    // Simulating API request
    setTimeout(() => {
      setIsLoading(false);
      toast.success('OTP Verified Successfully!');
      navigate('/');
    }, 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Verify OTP
        </h1>
        <p className="text-center text-gray-600">
          Enter the 6-digit OTP sent to your phone.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Enter OTP
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      maxLength={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-center text-xl tracking-widest"
                      placeholder="●●●●●●"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyOTP;

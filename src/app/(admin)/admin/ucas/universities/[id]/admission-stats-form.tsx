'use client';

import { AdmissionStats } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

const formSchema = z.object({
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 5),
  applied: z.coerce.number().int().min(0),
  accepted: z.coerce.number().int().min(0),
});

export function AdmissionStatsForm({ universityId, stats }: { universityId: string, stats: AdmissionStats[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      applied: 0,
      accepted: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = isEditing
      ? `/api/admin/admission-stats/${isEditing}`
      : `/api/admin/universities/${universityId}/stats`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast({ title: `Admission stats ${isEditing ? 'updated' : 'added'} successfully` });
      router.refresh();
      form.reset();
      setIsEditing(null);
    } else {
      toast({ title: `Failed to ${isEditing ? 'update' : 'add'} admission stats`, variant: 'destructive' });
    }
  }

  const handleEdit = (stat: AdmissionStats) => {
    setIsEditing(stat.id);
    form.reset({
      year: stat.year,
      applied: stat.applied,
      accepted: stat.accepted,
    })
  };

  const handleDelete = async (statId: number) => {
    if (!confirm('Are you sure you want to delete these stats?')) return;

    const response = await fetch(`/api/admin/admission-stats/${statId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        toast({ title: 'Admission stats deleted successfully' });
        router.refresh();
    } else {
        toast({ title: 'Failed to delete admission stats', variant: 'destructive' });
    }
  };

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{isEditing ? 'Edit' : 'Add'} Admission Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="applied"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Applied</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accepted"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Accepted</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                     {isEditing && (
                        <Button type="button" variant="ghost" onClick={() => { setIsEditing(null); form.reset(); }}>Cancel</Button>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Stats')}
                    </Button>
                </div>
            </form>
        </Form>

        <div className="mt-8">
            <h3 className="text-lg font-semibold">Existing Stats</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Accepted</TableHead>
                        <TableHead>Offer Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stats.sort((a,b) => b.year - a.year).map((stat) => (
                        <TableRow key={stat.id}>
                            <TableCell>{stat.year}</TableCell>
                            <TableCell>{stat.applied}</TableCell>
                            <TableCell>{stat.accepted}</TableCell>
                            <TableCell>{stat.applied > 0 ? `${((stat.accepted / stat.applied) * 100).toFixed(1)}%` : 'N/A'}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(stat)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(stat.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  );
} 
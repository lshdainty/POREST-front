import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'traditional' | 'memorial';
  description?: string;
  emoji: string;
}

const initialHolidays: Holiday[] = [
  {
    id: '1',
    name: '추석',
    date: '2024-09-28',
    type: 'traditional',
    description: '음력 8월 14일 - 8월 16일',
    emoji: '🌕'
  },
  {
    id: '2',
    name: '국군의 날 (임시 공휴일)',
    date: '2024-10-01',
    type: 'memorial',
    description: '',
    emoji: '🌲'
  },
  {
    id: '3',
    name: '개천절',
    date: '2024-10-03',
    type: 'national',
    description: '',
    emoji: '🇰🇷'
  },
  {
    id: '4',
    name: '한글날',
    date: '2024-10-09',
    type: 'national',
    description: '',
    emoji: '📚'
  }
];

const typeColors = {
  national: 'bg-blue-100 text-blue-800 border-blue-200',
  traditional: 'bg-orange-100 text-orange-800 border-orange-200',
  memorial: 'bg-green-100 text-green-800 border-green-200'
};

const typeLabels = {
  national: '국경일',
  traditional: '전통휴일',
  memorial: '기념일'
};

export default function Holiday() {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'national' as Holiday['type'],
    description: '',
    emoji: '🎉'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHoliday) {
      setHolidays(holidays.map(h => 
        h.id === editingHoliday.id 
          ? { ...editingHoliday, ...formData }
          : h
      ));
    } else {
      const newHoliday: Holiday = {
        id: Date.now().toString(),
        ...formData
      };
      setHolidays([...holidays, newHoliday]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      type: 'national',
      description: '',
      emoji: '🎉'
    });
    setEditingHoliday(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description || '',
      emoji: holiday.emoji
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className='flex w-full h-full p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        {/* 헤더 */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <Calendar className='h-8 w-8 text-blue-600' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>공휴일 관리</h1>
              <p className='text-gray-500 mt-1'>한국의 공휴일을 관리하고 추가할 수 있습니다</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                공휴일 추가
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>
                  {editingHoliday ? '공휴일 수정' : '새 공휴일 추가'}
                </DialogTitle>
                <DialogDescription>
                  공휴일 정보를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='name'>공휴일 이름</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder='예: 추석'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='emoji'>이모지</Label>
                    <Input
                      id='emoji'
                      value={formData.emoji}
                      onChange={(e) => setFormData({...formData, emoji: e.target.value})}
                      placeholder='🎉'
                      required
                    />
                  </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='date'>날짜</Label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='type'>타입</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({...formData, type: value as Holiday['type']})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='타입 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='national'>국경일</SelectItem>
                        <SelectItem value='traditional'>전통휴일</SelectItem>
                        <SelectItem value='memorial'>기념일</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor='description'>설명 (선택사항)</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder='음력 날짜나 추가 정보를 입력하세요'
                    rows={3}
                  />
                </div>
                
                <div className='flex justify-end gap-2 pt-4'>
                  <Button type='button' variant='outline' onClick={resetForm}>
                    취소
                  </Button>
                  <Button type='submit'>
                    {editingHoliday ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 공휴일 목록 */}
        <div className='grid gap-4'>
          {sortedHolidays.map((holiday) => (
            <Card key={holiday.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='text-3xl'>{holiday.emoji}</div>
                    <div>
                      <div className='flex items-center gap-3'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {holiday.name}
                        </h3>
                        <Badge className={typeColors[holiday.type]}>
                          {typeLabels[holiday.type]}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <p className='text-gray-600'>
                          {formatDate(holiday.date)}
                        </p>
                        {holiday.description && (
                          <>
                            <span className='text-gray-400'>•</span>
                            <p className='text-sm text-gray-500'>
                              {holiday.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(holiday)}
                      className='h-9 w-9 p-0'
                    >
                      <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(holiday.id)}
                      className='h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {holidays.length === 0 && (
            <Card>
              <CardContent className='p-12 text-center'>
                <Calendar className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  등록된 공휴일이 없습니다
                </h3>
                <p className='text-gray-500 mb-4'>
                  새로운 공휴일을 추가해보세요
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className='h-4 w-4 mr-2' />
                  첫 번째 공휴일 추가
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
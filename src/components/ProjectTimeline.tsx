import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Badge } from './ui/Badge';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

interface Deadline {
  label: string;
  date: string;
  completed: boolean;
}

interface ProjectTimelineProps {
  deadlines: Deadline[];
  isLeader: boolean;
}

export function ProjectTimeline({ deadlines, isLeader }: ProjectTimelineProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isLeader ? 'Timeline dự án' : 'Timeline đợt khóa luận'}</CardTitle>
        <CardDescription>Các mốc quan trọng trong quá trình thực hiện</CardDescription>
      </CardHeader>
      <CardContent>
        {deadlines.length > 0 ? (
          <div className="flex flex-row items-start justify-between w-full overflow-x-auto pb-4 gap-4 px-4">
            {deadlines.map((deadline, index) => (
              <div key={index} className="flex flex-col items-center flex-1 relative min-w-[120px]">
                {/* Horizontal line connector */}
                {index < deadlines.length - 1 && (
                  <div 
                    className={`absolute top-5 w-full h-0.5 -z-10 ${deadline.completed ? 'bg-green-200' : 'bg-gray-200'}`} 
                    style={{ left: '50%' }}
                  />
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  deadline.completed ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {deadline.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <h4 className="font-medium text-sm">{deadline.label}</h4>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{deadline.date}</span>
                  </div>
                  {deadline.completed && (
                    <Badge variant="default" className="mt-2 text-[10px] px-1.5 py-0">Hoàn thành</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">Không có timeline</div>
        )}
      </CardContent>
    </Card>
  );
}

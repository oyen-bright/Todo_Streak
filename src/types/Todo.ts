import {  HabitTracker,} from "./Habit";

export type Todo = {
  id: string;
  title: string;
  createdDate: string; 
  updatedDate: string; 
  type: TodoType;
  frequency: number | null; 
  days:number[]  | null; 
  tracking: HabitTracker | null
};

export enum TodoType {
  daily = 'daily',
  weekly = 'weekly',
}



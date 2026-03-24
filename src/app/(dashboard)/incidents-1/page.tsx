"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowUp, ListTodo, CheckCircle2, Clock, BarChart3 } from "lucide-react"

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"

import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, FileSpreadsheet, ShieldAlert } from "lucide-react"

import { AddTaskModal } from "./components/add-task-modal"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { RootState, AppDispatch } from "@/store"
import { fetchTasks, createTask } from "@/store/task-slice"
import { type Task } from "./data/schema"
import { categories, priorities } from "./data/data"

export default function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, loading, hasMore, nextIndex } = useSelector((state: RootState) => state.tasks)

  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current && tasks.length === 0) {
      hasFetched.current = true
      dispatch(fetchTasks({ startIndex: 0 }) as any)
    }
  }, [tasks.length, dispatch])

  // Adjusted: Use createTask thunk for adding tasks
  const handleAddTask = (newTask: Task) => {
    dispatch(createTask(newTask))
  }

  const loadMoreTasks = () => {
    if (hasMore && !loading) {
      dispatch(fetchTasks({ startIndex: nextIndex }))
    }
  }

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          A powerful task and issue tracker built with Tanstack Table.
        </p>
      </div>

      {/* Desktop Stats */}
      <div className="flex flex-1 flex-col space-y-6 px-4 md:px-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Tasks</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.total}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <ListTodo className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Completed</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.completed}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">In Progress</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.inProgress}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {Math.round((stats.inProgress / stats.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <Clock className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Pending</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.pending}</span>
                    <span className="flex items-center gap-0.5 text-sm text-orange-500">
                      <ArrowUp className="size-3.5" />
                      {Math.round((stats.pending / stats.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <BarChart3 className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* {priorities.critical > 0 && ( */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                  <ShieldAlert className="size-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-300">
                    {/* Attention Required: {priorities.critical} High Priority Complaints Open */}
                    Attention Required: 5 High Priority Complaints Open 
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        {/* )} */}

        {/* Data Table */}
        <Card>
          {/* <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>
              View, filter, and manage all your project tasks in one place
            </CardDescription>
          </CardHeader> */}
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="space-y-1">
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  View, filter, and manage all your project tasks in one place
                </CardDescription>
              </div>

              <div className="flex items-center gap-3 shrink-0">

                <ButtonGroup>
                  <Button variant="outline"><Upload />Import</Button>
                  <Button variant="outline"><Download />Export</Button>
                </ButtonGroup>

                <AddTaskModal />

              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tasks}
              columns={columns}
              onAddTask={handleAddTask}
              onLoadMore={loadMoreTasks}
              hasMore={hasMore}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ArrowUp,
  ListTodo,
  CheckCircle2,
  Clock,
  BarChart3,
  Upload,
  Download,
  ShieldAlert,
} from "lucide-react"

import { ButtonGroup } from "@/components/ui/button-group"

import { Button } from "@/components/ui/button"
import { AddIncidentModal } from "./components/add-incident-modal"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

import { RootState, AppDispatch } from "@/store"
import {
  fetchIncidents,
  createIncident,
} from "@/store/incident-slice"

import { type Incident } from "@/schemas/incident-schema"

export default function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const { incidents, loading, hasMore, nextIndex } = useSelector(
    (state: RootState) => state.incidents
  )

  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current && incidents.length === 0) {
      hasFetched.current = true
      dispatch(fetchIncidents({ startIndex: 0 }) as any)
    }
  }, [incidents.length, dispatch])

  const handleAddIncident = (newIncident: Incident) => {
    dispatch(createIncident(newIncident))
  }

  const loadMoreIncidents = () => {
    if (hasMore && !loading) {
      dispatch(fetchIncidents({ startIndex: nextIndex }))
    }
  }

  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "OPEN").length,
    inProgress: incidents.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: incidents.filter((i) => i.status === "RESOLVED").length,
  }

  if (loading && incidents.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading incidents...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground">
          A powerful incident reporting and tracking system.
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-6 px-4 md:px-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Incidents
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.total}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {stats.total > 0
                        ? Math.round((stats.resolved / stats.total) * 100)
                        : 0}
                      %
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
                  <p className="text-muted-foreground text-sm font-medium">
                    Resolved
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.resolved}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {stats.total > 0
                        ? Math.round((stats.resolved / stats.total) * 100)
                        : 0}
                      %
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
                  <p className="text-muted-foreground text-sm font-medium">
                    In Progress
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {stats.inProgress}
                    </span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {stats.total > 0
                        ? Math.round((stats.inProgress / stats.total) * 100)
                        : 0}
                      %
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
                  <p className="text-muted-foreground text-sm font-medium">
                    Open
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.open}</span>
                    <span className="flex items-center gap-0.5 text-sm text-orange-500">
                      <ArrowUp className="size-3.5" />
                      {stats.total > 0
                        ? Math.round((stats.open / stats.total) * 100)
                        : 0}
                      %
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

        {incidents.some((i) => i.severity === "CRITICAL") && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                  <ShieldAlert className="size-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-300">
                    Attention Required: Critical Incidents Open
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>
                  View, filter, and manage all reported incidents
                </CardDescription>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ButtonGroup>
                  <Button variant="outline">
                    <Upload />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download />
                    Export
                  </Button>
                </ButtonGroup>

                <AddIncidentModal />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <DataTable
              data={incidents}
              columns={columns}
              onAddTask={handleAddIncident}
              onLoadMore={loadMoreIncidents}
              hasMore={hasMore}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
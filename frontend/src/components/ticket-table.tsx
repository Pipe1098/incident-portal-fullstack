"use client"

import type { Ticket, TicketStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface TicketTableProps {
    tickets: Ticket[]
    onStatusChange: (id: string, status: TicketStatus) => void
    onDelete: (id: string) => void
    onView: (ticket: Ticket) => void
}

const statusConfig: Record<
    TicketStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    OPEN: { label: "Abierto", variant: "destructive" },
    IN_PROGRESS: { label: "En Progreso", variant: "default" },
    RESOLVED: { label: "Resuelto", variant: "secondary" },
    CLOSED: { label: "Cerrado", variant: "outline" },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
    LOW: { label: "Baja", className: "bg-muted text-muted-foreground" },
    MEDIUM: { label: "Media", className: "bg-status-in-progress/20 text-status-in-progress" },
    HIGH: { label: "Alta", className: "bg-status-open/20 text-status-open" },
    CRITICAL: { label: "Crítica", className: "bg-destructive/20 text-destructive" },
}

export function TicketTable({ tickets, onStatusChange, onDelete, onView }: TicketTableProps) {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No hay tickets para mostrar</p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Ticket</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-muted-foreground">Prioridad</TableHead>
                        <TableHead className="text-muted-foreground hidden md:table-cell">Creado</TableHead>
                        <TableHead className="text-muted-foreground hidden lg:table-cell">Asignado</TableHead>
                        <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="border-border hover:bg-secondary/50">
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{ticket.title}</span>
                                    <span className="text-sm text-muted-foreground truncate max-w-[300px]">{ticket.description}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusConfig[ticket.status].variant}>{statusConfig[ticket.status].label}</Badge>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${priorityConfig[ticket.priority].className}`}
                                >
                                    {priorityConfig[ticket.priority].label}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: es })}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">{ticket.assignedTo || "-"}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border-border">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem onClick={() => onView(ticket)}>
                                            <Eye className="mr-2 h-4 w-4" /> Ver detalles
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar estado</DropdownMenuLabel>
                                        {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as TicketStatus[]).map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onClick={() => onStatusChange(ticket.id, status)}
                                                disabled={ticket.status === status}
                                            >
                                                <Edit className="mr-2 h-4 w-4" /> {statusConfig[status].label}
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem onClick={() => onDelete(ticket.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

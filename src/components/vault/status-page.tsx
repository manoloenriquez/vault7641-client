'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, XCircle, Clock, Zap, Database, Globe, MessageCircle } from 'lucide-react'

const services = [
  {
    name: 'Website',
    description: 'Main website and landing pages',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '245ms',
    icon: Globe,
  },
  {
    name: 'Mint System',
    description: 'NFT minting and candy machine',
    status: 'operational',
    uptime: '99.8%',
    responseTime: '1.2s',
    icon: Zap,
  },
  {
    name: 'Database',
    description: 'User data and guild information',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '89ms',
    icon: Database,
  },
  {
    name: 'Discord Bot',
    description: 'Community verification and management',
    status: 'operational',
    uptime: '99.7%',
    responseTime: '156ms',
    icon: MessageCircle,
  },
  {
    name: 'Solana RPC',
    description: 'Blockchain connectivity and transactions',
    status: 'degraded',
    uptime: '98.2%',
    responseTime: '3.4s',
    icon: Zap,
  },
]

const incidents = [
  {
    id: 1,
    title: 'Solana RPC Performance Degradation',
    status: 'investigating',
    severity: 'minor',
    startTime: '2024-12-27T14:30:00Z',
    description:
      'We are experiencing slower than normal response times from our Solana RPC providers. Mint transactions may take longer to process.',
    updates: [
      {
        time: '2024-12-27T15:15:00Z',
        message: 'We have identified the issue and are working with our RPC providers to resolve it.',
      },
      {
        time: '2024-12-27T14:45:00Z',
        message: 'Investigating reports of slow transaction processing times.',
      },
    ],
  },
  {
    id: 2,
    title: 'Scheduled Maintenance - Discord Bot Updates',
    status: 'completed',
    severity: 'maintenance',
    startTime: '2024-12-26T02:00:00Z',
    endTime: '2024-12-26T02:30:00Z',
    description: 'Scheduled maintenance to update our Discord verification bot with new features.',
    updates: [
      {
        time: '2024-12-26T02:30:00Z',
        message: 'Maintenance completed successfully. All systems operational.',
      },
      {
        time: '2024-12-26T02:00:00Z',
        message: 'Maintenance window started. Discord verification temporarily unavailable.',
      },
    ],
  },
]

const statusConfig = {
  operational: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
    label: 'Operational',
  },
  degraded: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: AlertCircle,
    label: 'Degraded Performance',
  },
  outage: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
    label: 'Outage',
  },
  maintenance: {
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Clock,
    label: 'Maintenance',
  },
}

const incidentSeverity = {
  minor: 'bg-yellow-500/20 text-yellow-400',
  major: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
  maintenance: 'bg-blue-500/20 text-blue-400',
}

const incidentStatus = {
  investigating: 'bg-yellow-500/20 text-yellow-400',
  identified: 'bg-orange-500/20 text-orange-400',
  monitoring: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/20 text-green-400',
}

export function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const overallStatus = services.some((s) => s.status === 'outage')
    ? 'outage'
    : services.some((s) => s.status === 'degraded')
      ? 'degraded'
      : 'operational'

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'completed')

  const StatusIcon = statusConfig[overallStatus].icon

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">System Status</h1>
            <p className="text-xl text-muted-foreground">
              Current operational status of Vault 7641 services and infrastructure
            </p>
          </div>

          {/* Overall Status */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <StatusIcon className="w-8 h-8 text-current" />
              <h2 className="text-3xl font-bold">
                {overallStatus === 'operational'
                  ? 'All Systems Operational'
                  : overallStatus === 'degraded'
                    ? 'Some Systems Degraded'
                    : 'Service Disruption'}
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {overallStatus === 'operational'
                ? 'All systems are running smoothly'
                : 'Some services may be experiencing issues'}
            </p>
            <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</div>
          </div>

          {/* Active Incidents */}
          {activeIncidents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Active Incidents</h2>
              <div className="space-y-6">
                {activeIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{incident.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={incidentStatus[incident.status as keyof typeof incidentStatus]}>
                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                          </Badge>
                          <Badge className={incidentSeverity[incident.severity as keyof typeof incidentSeverity]}>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Started: {new Date(incident.startTime).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{incident.description}</p>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Updates:</h4>
                      {incident.updates.map((update, index) => (
                        <div key={index} className="flex gap-4 text-sm">
                          <div className="text-muted-foreground min-w-fit">
                            {new Date(update.time).toLocaleString()}
                          </div>
                          <div>{update.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Status */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Service Status</h2>
            <div className="space-y-4">
              {services.map((service, index) => {
                const config = statusConfig[service.status as keyof typeof statusConfig]
                return (
                  <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="font-semibold">{service.uptime}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Response</div>
                          <div className="font-semibold">{service.responseTime}</div>
                        </div>
                        <Badge className={config.color}>
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold mb-2">{incident.title}</h3>
                      <div className="flex gap-2">
                        <Badge className={incidentStatus[incident.status as keyof typeof incidentStatus]}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </Badge>
                        <Badge className={incidentSeverity[incident.severity as keyof typeof incidentSeverity]}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      <div>Started: {new Date(incident.startTime).toLocaleString()}</div>
                      {incident.endTime && <div>Resolved: {new Date(incident.endTime).toLocaleString()}</div>}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{incident.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">Get notified about service updates and maintenance windows</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl font-semibold transition-all"
              >
                Subscribe to Updates
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-border/50 hover:bg-muted/50 rounded-xl font-semibold transition-all"
              >
                RSS Feed
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

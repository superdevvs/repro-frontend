
import React, { useState } from 'react';
import { format } from 'date-fns'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useShoots } from '@/context/ShootsContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientDetail } from '@/components/clients/ClientDetail';
import { ClientStats } from '@/components/clients/ClientStats';
import { formatDateSafe, ensureDateString } from '@/utils/formatters';

export function Clients() {
  const { shoots } = useShoots();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = shoots
    .map(shoot => shoot.client)
    .filter((client, index, self) =>
      index === self.findIndex((t) => (
        t.email === client.email
      ))
    )
    .filter(client =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
  };

  const handleCloseClientDetail = () => {
    setSelectedClient(null);
  };

  const getClientShootsByStatus = (client: any, status: string) => {
    return shoots.filter(shoot => shoot.client.email === client.email && shoot.status === status);
  };

  // Fix the date formatting in render methods using our utility functions
  const formatClientDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Not available';
    return formatDateSafe(dateString);
  };

  // Calculate client statistics
  const totalClients = filteredClients.length;
  const activeClients = Math.round(totalClients * 0.7); // Example: 70% of clients are active
  const inactiveClients = totalClients - activeClients;
  const totalClientShoots = shoots.length;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Manage your clients and view their shoot history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedClient ? (
            <ClientDetail client={selectedClient} onClose={handleCloseClientDetail} />
          ) : (
            <>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Clients</TabsTrigger>
                  <TabsTrigger value="stats">Client Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Total Shoots</TableHead>
                        <TableHead>Last Shoot Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => {
                        // Find the client's shoots and get the last shoot
                        const clientShoots = shoots.filter(shoot => shoot.client.email === client.email);
                        const lastShoot = clientShoots.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];

                        return (
                          <TableRow key={client.email}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar>
                                  <AvatarImage src={`https://avatar.vercel.sh/${client.email}.png`} alt={client.name || "Client"} />
                                  <AvatarFallback>{client.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{client.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.company}</TableCell>
                            <TableCell>{clientShoots.length}</TableCell>
                            <TableCell>{lastShoot ? formatClientDate(lastShoot.scheduledDate) : 'No shoots yet'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleClientClick(client)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="stats" className="mt-4">
                  <ClientStats 
                    totalClients={totalClients}
                    activeClients={activeClients}
                    inactiveClients={inactiveClients}
                    totalShoots={totalClientShoots}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

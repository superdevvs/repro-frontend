import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import usePhotographersData from "@/components/photographers/usePhotographersData";

export function Photographers() {
  const { photographers, loading, error } = usePhotographersData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPhotographers = photographers.filter(photographer =>
    photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photographer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading photographers...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Photographers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search photographers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPhotographers.map((photographer) => (
                <TableRow key={photographer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={photographer.avatar} alt={photographer.name} />
                        <AvatarFallback>{photographer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{photographer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{photographer.email}</TableCell>
                  <TableCell>{photographer.phone}</TableCell>
                  <TableCell>{photographer.address}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, Search, Calendar, AlertCircle, User, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrackStatus } from './TrackStatus';
import { NewGrievanceFormWrapper } from './NewGrievanceFormWrapper';

interface GrievancesProps {
  user: any;
  onBackToDashboard?: () => void;
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-500';
    case 'In Progress': return 'bg-yellow-500';
    case 'Resolved': return 'bg-green-500';
    case 'Rejected': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-orange-500';
    case 'Low': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

export function Grievances({ user, onBackToDashboard }: GrievancesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewGrievance, setShowNewGrievance] = useState(false);
  const [showTrackDialog, setShowTrackDialog] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const grievances = [
    {
      id: 'GRV-2025-023',
      connectionId: 'CON-2025-001',
      category: 'Billing Issue',
      subject: 'Incorrect meter reading in bill',
      description: 'The meter reading shown in last month bill is incorrect. Actual reading is 1200 but bill shows 1350.',
      status: 'In Progress',
      priority: 'High',
      submittedDate: 'Dec 15, 2025',
      lastUpdate: 'Dec 18, 2025',
      assignedTo: 'Officer - Priya Sharma',
      updates: [
        { date: 'Dec 18, 2025', by: 'Priya Sharma', message: 'We have verified your complaint and found the discrepancy. A field officer will visit your property for meter verification within 2 days.' },
        { date: 'Dec 16, 2025', by: 'System', message: 'Grievance assigned to Water Tax Officer - Ward 5' },
        { date: 'Dec 15, 2025', by: 'Rajesh Kumar', message: 'Grievance submitted' }
      ],
      expectedResolution: 'Dec 25, 2025'
    },
    {
      id: 'GRV-2025-018',
      connectionId: 'CON-2025-002',
      category: 'Water Supply',
      subject: 'Low water pressure',
      description: 'Water pressure is very low during morning hours (6 AM to 9 AM). Unable to fill overhead tank.',
      status: 'Resolved',
      priority: 'Medium',
      submittedDate: 'Dec 10, 2025',
      lastUpdate: 'Dec 14, 2025',
      assignedTo: 'Officer - Amit Patel',
      resolvedDate: 'Dec 14, 2025',
      resolution: 'Main pipeline pressure issue was identified and fixed. Water pressure has been restored to normal levels.',
      updates: [
        { date: 'Dec 14, 2025', by: 'Amit Patel', message: 'Issue resolved. Main pipeline pressure adjusted. Please check and confirm.' },
        { date: 'Dec 12, 2025', by: 'Amit Patel', message: 'Field inspection completed. Issue identified in main pipeline pressure. Maintenance scheduled for Dec 14.' },
        { date: 'Dec 10, 2025', by: 'System', message: 'Grievance assigned to Water Supply Officer - Ward 8' },
        { date: 'Dec 10, 2025', by: 'Rajesh Kumar', message: 'Grievance submitted' }
      ]
    },
    {
      id: 'GRV-2025-015',
      connectionId: 'CON-2025-001',
      category: 'Connection',
      subject: 'Water leakage at meter point',
      description: 'There is continuous water leakage at the meter connection point. Water is being wasted.',
      status: 'Rejected',
      priority: 'High',
      submittedDate: 'Dec 05, 2025',
      lastUpdate: 'Dec 08, 2025',
      assignedTo: 'Officer - Priya Sharma',
      resolvedDate: 'Dec 07, 2025',
      resolution: 'Meter connection replaced. Leakage stopped. No charges for wasted water.',
      updates: [
        { date: 'Dec 08, 2025', by: 'System', message: 'Grievance closed after confirmation' },
        { date: 'Dec 07, 2025', by: 'Priya Sharma', message: 'Meter connection replaced. Issue resolved. Please verify.' },
        { date: 'Dec 06, 2025', by: 'Priya Sharma', message: 'Field team dispatched for immediate repair' },
        { date: 'Dec 05, 2025', by: 'System', message: 'Grievance marked as urgent and assigned' },
        { date: 'Dec 05, 2025', by: 'Rajesh Kumar', message: 'Grievance submitted' }
      ]
    }
  ];

  const filteredGrievances = grievances.filter(grv =>
    grv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openGrievances = filteredGrievances.filter(g => g.status === 'Open' || g.status === 'In Progress');
  const resolvedGrievances = filteredGrievances.filter(g => g.status === 'Resolved');
  const rejectedGrievances = filteredGrievances.filter(g => g.status === 'Rejected');

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 mt-[75px]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col px-6 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">My Grievances</h2>
            <p className="text-xs text-gray-600">Submit and track your complaints</p>
          </div>
          <Dialog open={showNewGrievance} onOpenChange={setShowNewGrievance}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg h-9 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Grievance
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[100vw] sm:w-[96vw] !max-w-[100vw] sm:!max-w-[96vw] h-auto max-h-[95vh] sm:max-h-[92vh] overflow-hidden bg-white flex flex-col p-0">
              <DialogHeader className="border-b pb-4 px-6 pt-6">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Submit New Grievance
                </DialogTitle>
                <DialogDescription>
                  You are about to submit a complaint or grievance for your water connection
                </DialogDescription>
              </DialogHeader>
              <NewGrievanceFormWrapper 
                user={user} 
                onClose={() => setShowNewGrievance(false)}
                onBackToDashboard={onBackToDashboard}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab('all')}
          >
            <Card className={`p-2 shadow-lg border-2 transition-all ${activeTab === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'} bg-gradient-to-br from-blue-300 to-cyan-400`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-semibold">Total Grievances</p>
                  <p className="text-xl text-gray-900 font-bold">{grievances.length}</p>
                  <p className="text-[9px] text-gray-900 font-semibold">All submissions</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab('open')}
          >
            <Card className={`p-2 shadow-lg border-2 transition-all ${activeTab === 'open' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-transparent'} bg-gradient-to-br from-yellow-300 to-orange-400`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-semibold">In Progress</p>
                  <p className="text-xl text-gray-900 font-bold">{grievances.filter(g => g.status === 'In Progress').length}</p>
                  <p className="text-[9px] text-gray-900 font-semibold">Being processed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab('resolved')}
          >
            <Card className={`p-2 shadow-lg border-2 transition-all ${activeTab === 'resolved' ? 'border-green-500 ring-2 ring-green-200' : 'border-transparent'} bg-gradient-to-br from-green-300 to-teal-400`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-semibold">Resolved</p>
                  <p className="text-xl text-gray-900 font-bold">{resolvedGrievances.length}</p>
                  <p className="text-[9px] text-gray-900 font-semibold">Successfully closed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab('closed')}
          >
            <Card className={`p-2 shadow-lg border-2 transition-all ${activeTab === 'closed' ? 'border-gray-500 ring-2 ring-gray-300' : 'border-transparent'} bg-gradient-to-br from-gray-300 to-gray-400`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-semibold">Rejected</p>
                  <p className="text-xl text-gray-900 font-bold">{rejectedGrievances.length}</p>
                  <p className="text-[9px] text-gray-900 font-semibold">Not approved</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search grievances by ID, subject, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm bg-white"
            />
          </div>
        </Card>

        {/* Grievances Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">All ({grievances.length})</TabsTrigger>
            <TabsTrigger value="open" className="text-xs">Open ({openGrievances.length})</TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs">Resolved ({resolvedGrievances.length})</TabsTrigger>
            <TabsTrigger value="closed" className="text-xs">Rejected ({rejectedGrievances.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto mt-2 space-y-2">
            {filteredGrievances.map((grievance, index) => (
              <GrievanceCard 
                key={grievance.id} 
                grievance={grievance} 
                index={index}
                onTrack={(id) => {
                  setSelectedTrackingId(id);
                  setShowTrackDialog(true);
                }}
                onDetails={(g) => {
                  setSelectedGrievance(g);
                  setShowDetailsDialog(true);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="open" className="flex-1 overflow-y-auto mt-2 space-y-2">
            {openGrievances.map((grievance, index) => (
              <GrievanceCard 
                key={grievance.id} 
                grievance={grievance} 
                index={index}
                onTrack={(id) => {
                  setSelectedTrackingId(id);
                  setShowTrackDialog(true);
                }}
                onDetails={(g) => {
                  setSelectedGrievance(g);
                  setShowDetailsDialog(true);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="flex-1 overflow-y-auto mt-2 space-y-2">
            {resolvedGrievances.map((grievance, index) => (
              <GrievanceCard 
                key={grievance.id} 
                grievance={grievance} 
                index={index}
                onTrack={(id) => {
                  setSelectedTrackingId(id);
                  setShowTrackDialog(true);
                }}
                onDetails={(g) => {
                  setSelectedGrievance(g);
                  setShowDetailsDialog(true);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="closed" className="flex-1 overflow-y-auto mt-2 space-y-2">
            {rejectedGrievances.map((grievance, index) => (
              <GrievanceCard 
                key={grievance.id} 
                grievance={grievance} 
                index={index}
                onTrack={(id) => {
                  setSelectedTrackingId(id);
                  setShowTrackDialog(true);
                }}
                onDetails={(g) => {
                  setSelectedGrievance(g);
                  setShowDetailsDialog(true);
                }}
              />
            ))}
          </TabsContent>
        </Tabs>

        {filteredGrievances.length === 0 && (
          <Card className="p-12 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No grievances found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or submit a new grievance</p>
            <Button onClick={() => setShowNewGrievance(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Plus className="w-4 h-4 mr-2" />
              Submit New Grievance
            </Button>
          </Card>
        )}
      </div>

      {/* Track Status Dialog */}
      <TrackStatus 
        open={showTrackDialog} 
        onOpenChange={setShowTrackDialog}
        initialId={selectedTrackingId}
      />

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[100vw] sm:w-[96vw] !max-w-[100vw] sm:!max-w-[96vw] h-auto max-h-[95vh] sm:max-h-[92vh] overflow-hidden bg-white flex flex-col p-0">
          <DialogHeader className="border-b pb-4 px-6 pt-6">
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Grievance Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected grievance
            </DialogDescription>
          </DialogHeader>
          {selectedGrievance && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  {selectedGrievance.status === 'Resolved' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : selectedGrievance.status === 'Rejected' ? (
                    <XCircle className="w-4 h-4 text-white" />
                  ) : selectedGrievance.status === 'In Progress' ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{selectedGrievance.id}</h3>
                    <Badge className={`${getStatusColor(selectedGrievance.status)} text-white border-0 px-2 py-0 text-[10px]`}>
                      {selectedGrievance.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedGrievance.priority)} text-white border-0 px-2 py-0 text-[10px]`}>
                      {selectedGrievance.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-900 truncate">{selectedGrievance.subject}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="text-gray-900 font-semibold">{selectedGrievance.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Submitted</p>
                  <p className="text-gray-900 font-semibold">{selectedGrievance.submittedDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Update</p>
                  <p className="text-gray-900 font-semibold">{selectedGrievance.lastUpdate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Assigned to</p>
                  <p className="text-gray-900 font-semibold truncate max-w-[150px]">{selectedGrievance.assignedTo}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-semibold text-gray-900">Description:</span>
                </p>
                <p className="text-xs text-gray-700">{selectedGrievance.description}</p>
              </div>
              {selectedGrievance.updates && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-semibold text-gray-900">Updates:</span>
                  </p>
                  <div className="space-y-2">
                    {selectedGrievance.updates.map((update, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-700">{update.date} - {update.by}: {update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedGrievance.status === 'Resolved' && selectedGrievance.resolution && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-semibold text-green-700">Resolution:</span>
                  </p>
                  <p className="text-xs text-gray-700">{selectedGrievance.resolution}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Grievance Card Component
function GrievanceCard({ grievance, index, onTrack, onDetails }: { grievance: any; index: number; onTrack: (id: string) => void; onDetails: (g: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-3 shadow-lg border-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 backdrop-blur-sm hover:shadow-xl hover:scale-[1.01] transition-all">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div className={`w-9 h-9 rounded-lg ${getStatusColor(grievance.status)} flex items-center justify-center flex-shrink-0 shadow-md`}>
            {grievance.status === 'Resolved' ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : grievance.status === 'Rejected' ? (
              <XCircle className="w-4 h-4 text-white" />
            ) : grievance.status === 'In Progress' ? (
              <Clock className="w-4 h-4 text-white" />
            ) : (
              <MessageSquare className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-gray-900">{grievance.id}</h3>
              <Badge className={`${getStatusColor(grievance.status)} text-white border-0 px-2 py-0 text-[10px]`}>
                {grievance.status}
              </Badge>
              <Badge className={`${getPriorityColor(grievance.priority)} text-white border-0 px-2 py-0 text-[10px]`}>
                {grievance.priority}
              </Badge>
            </div>
            <p className="text-xs text-gray-900 truncate">{grievance.subject}</p>
          </div>

          {/* Category & Date Info */}
          <div className="flex items-center gap-4 text-xs">
            <div>
              <p className="text-gray-600">Category</p>
              <p className="text-gray-900 font-semibold">{grievance.category}</p>
            </div>
            <div>
              <p className="text-gray-600">Submitted</p>
              <p className="text-gray-900 font-semibold">{grievance.submittedDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Update</p>
              <p className="text-gray-900 font-semibold">{grievance.lastUpdate}</p>
            </div>
            <div>
              <p className="text-gray-600">Assigned to</p>
              <p className="text-gray-900 font-semibold truncate max-w-[150px]">{grievance.assignedTo}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTrack(grievance.id)}
              className="h-8 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              Track
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDetails(grievance)}
              className="h-8 text-xs bg-cyan-50 hover:bg-cyan-100 border-cyan-200"
            >
              Details
            </Button>
          </div>
        </div>

        {/* Resolution (if resolved) */}
        {grievance.status === 'Resolved' && grievance.resolution && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-semibold text-green-700">Resolution:</span>
            </p>
            <p className="text-xs text-gray-700">{grievance.resolution}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, UserCheck, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      fetchData();
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
        if (response.data.role !== 'ADMIN') {
          navigate('/');
          return;
        }
        setUser(response.data);
        fetchData();
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  const fetchData = async () => {
    try {
      const [usersRes, mentorsRes, leadsRes, analyticsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/users`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/admin/mentors`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/admin/leads`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/admin/analytics`, { withCredentials: true }),
      ]);
      
      setUsers(usersRes.data);
      setMentors(mentorsRes.data);
      setLeads(leadsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMentor = async (mentorId, status) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/mentors/${mentorId}/verify`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Mentor ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update mentor status');
    }
  };

  const handleVerifyLead = async (leadId, status) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/leads/${leadId}/verify`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Lead ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" data-testid="admin-dashboard">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, mentors, and leads</p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-2xl font-heading font-bold">{analytics.total_users}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Mentors</p>
                  <p className="text-2xl font-heading font-bold">{analytics.total_mentors}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Leads</p>
                  <p className="text-2xl font-heading font-bold">{analytics.total_leads}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-border shadow-sm rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-2xl font-heading font-bold">₹{analytics.total_revenue}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="mentors" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="mentors" data-testid="tab-mentors">Mentors</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Leads</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Mentor Verification</h2>
              
              {mentors.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">No mentors registered yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentors.map((mentor) => (
                    <div
                      key={mentor.mentor_id}
                      className="border border-border rounded-lg p-6"
                      data-testid={`mentor-${mentor.mentor_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold mb-1">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{mentor.email}</p>
                          {mentor.bio && (
                            <p className="text-sm text-foreground mb-2">{mentor.bio}</p>
                          )}
                          {mentor.expertise && mentor.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {mentor.expertise.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              mentor.verification_status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : mentor.verification_status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {mentor.verification_status}
                          </span>
                          {mentor.verification_status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleVerifyMentor(mentor.mentor_id, 'APPROVED')}
                                className="bg-green-600 hover:bg-green-700 rounded-full"
                                data-testid={`approve-mentor-${mentor.mentor_id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyMentor(mentor.mentor_id, 'REJECTED')}
                                className="text-red-600 hover:bg-red-50 rounded-full"
                                data-testid={`reject-mentor-${mentor.mentor_id}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Lead Verification</h2>
              
              {leads.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">No leads yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.lead_id}
                      className="border border-border rounded-lg p-6"
                      data-testid={`lead-${lead.lead_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold mb-2">{lead.event_title}</h3>
                          <div className="space-y-1 text-sm">
                            <p><strong>Name:</strong> {lead.name}</p>
                            <p><strong>Email:</strong> {lead.email}</p>
                            <p><strong>Phone:</strong> {lead.phone}</p>
                            {lead.message && <p><strong>Message:</strong> {lead.message}</p>}
                            <p className="text-muted-foreground">
                              Verification: {lead.verification_status}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lead.status === 'VERIFIED'
                                ? 'bg-green-100 text-green-800'
                                : lead.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : lead.status === 'PURCHASED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {lead.status}
                          </span>
                          {lead.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleVerifyLead(lead.lead_id, 'VERIFIED')}
                                className="bg-green-600 hover:bg-green-700 rounded-full"
                                data-testid={`verify-lead-${lead.lead_id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyLead(lead.lead_id, 'REJECTED')}
                                className="text-red-600 hover:bg-red-50 rounded-full"
                                data-testid={`reject-lead-${lead.lead_id}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white border border-border shadow-sm rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">All Users</h2>
              
              {users.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <p className="text-muted-foreground">No users registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-heading">Name</th>
                        <th className="text-left py-3 px-4 font-heading">Email</th>
                        <th className="text-left py-3 px-4 font-heading">Role</th>
                        <th className="text-left py-3 px-4 font-heading">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.user_id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{u.name}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'MENTOR'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;

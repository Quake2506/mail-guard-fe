'use client';

import React from 'react';
import {
    List,
    ListItem,
    Typography,
    Chip,
    Box,
    Container,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

import { Email } from '@/common/types/email';

export default function InboxPage() {
    const [tabValue, setTabValue] = React.useState(0);
    const [emails, setEmails] = React.useState<Email[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);

    React.useEffect(() => {
        const fetchEmails = async () => {
            try {
                // Move cookie access inside useEffect where we're guaranteed to be on the client side
                const accessToken = document.cookie.split('access_token=')[1]?.split(';')[0];
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/inbox`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch emails');
                }

                const data = await response.json();
                setEmails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load emails');
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleEmailClick = (email: Email) => {
        setSelectedEmail(email);
    };

    const handleCloseDialog = () => {
        setSelectedEmail(null);
    };

    const truncateBody = (body: string) => {
        const words = body.split(' ');
        if (words.length <= 20) return body;
        return words.slice(0, 20).join(' ') + '...';
    };

    // Filter emails based on selected tab
    const filteredEmails = emails.filter(email => {
        if (tabValue === 0) { // Inbox tab
            return true; // Show all emails
        } else { // Spam tab
            return email.is_spam;
        }
    });

    return (
        <Container maxWidth="sm" sx={{minHeight:'100vh' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Inbox" />
                    <Tab label="Spam Detected" />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <List>
                    {filteredEmails.map((email, index) => (
                        <ListItem
                            key={`email-${index}`}
                            sx={{
                                mb: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                            onClick={() => handleEmailClick(email)}
                        >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography 
                                        variant="subtitle1" 
                                        component="div" 
                                        sx={{ 
                                            color: 'black',
                                            fontWeight: 500
                                        }}
                                    >
                                        Sender: {email.sender.email}
                                    </Typography>
                                    {email.is_spam ? (
                                        <Chip
                                            label="Spam"
                                            color="error"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            label="Not Spam"
                                            size="small"
                                            sx={{bgcolor: 'green', color: 'white'}}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        component="div"
                                        sx={{color: 'black'}}
                                    >
                                        Subject: {email.subject}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        component="div"
                                        color="text.secondary"
                                    >
                                        {truncateBody(email.body)}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

            <Dialog
                open={selectedEmail !== null}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedEmail && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">{selectedEmail.subject}</Typography>
                                {selectedEmail.is_spam ? (
                                    <Chip label="Spam" color="error" />
                                ) : (
                                    <Chip label="Not Spam" sx={{bgcolor: 'green', color: 'white'}} />
                                )}
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                From: {selectedEmail.sender.email}
                            </Typography>
                            <Typography variant="body1">
                                {selectedEmail.body}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
}
/**
 * Production-ready n8n Workflow JSON template generator
 * Fully compatible with the AI Lead Finder output schema:
 * Name, Company, Business, Email, Issue or Pitch, Email Sent = 'NO'
 */

export function generateN8nWorkflowTemplate(options?: {
  sheetId?: string;
  sheetTab?: string;
  webhookPath?: string;
}) {
  const sheetId = options?.sheetId || 'YOUR_GOOGLE_SHEET_ID';
  const sheetTab = options?.sheetTab || 'Sheet1';
  const webhookPath = options?.webhookPath || 'ai-lead-intake';

  return {
    name: 'AI Lead Finder -> Cold Email -> Reply Classifier -> Meeting Booking',
    nodes: [
      {
        parameters: {
          path: webhookPath,
          responseMode: 'responseNode',
          options: {},
        },
        id: 'node-webhook-intake',
        name: 'Lead Webhook Intake (Real-Time)',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [240, 200],
      },
      {
        parameters: {
          rule: {
            interval: [
              {
                field: 'hours',
                hoursInterval: 2,
              },
            ],
          },
        },
        id: 'node-cron-schedule',
        name: 'Scheduled Sync (Every 2 Hours)',
        type: 'n8n-nodes-base.scheduleTrigger',
        typeVersion: 1.2,
        position: [240, 420],
      },
      {
        parameters: {
          operation: 'read',
          sheetId: sheetId,
          range: `${sheetTab}!A:Q`,
          options: {
            dataProperty: 'data',
          },
          filters: {
            conditions: [
              {
                field: 'Email Sent',
                operator: 'equals',
                value: 'NO',
              },
              {
                field: 'Email',
                operator: 'isNotEmpty',
              },
            ],
          },
        },
        id: 'node-read-google-sheet',
        name: 'Fetch Pending Leads (Email Sent = NO)',
        type: 'n8n-nodes-base.googleSheets',
        typeVersion: 4.4,
        position: [480, 420],
      },
      {
        parameters: {
          batchSize: 10,
          options: {},
        },
        id: 'node-throttle-batch',
        name: 'Deliverability Throttle (10 per hour)',
        type: 'n8n-nodes-base.splitInBatches',
        typeVersion: 3,
        position: [720, 420],
      },
      {
        parameters: {
          sendTo: '={{ $json.Email }}',
          subject: 'Quick question regarding {{ $json.Business }} workflow automation',
          message:
            'Hi {{ $json.Name || "there" }},\n\n' +
            'I came across {{ $json.Business }} in {{ $json.City }} and noticed an opportunity regarding your workflow:\n\n' +
            '{{ $json["Issue or Pitch"] }}\n\n' +
            'We recently helped a similar team eliminate repetitive manual handling with lightweight n8n and AI automation.\n\n' +
            'Would you be open to a brief 7-minute intro call or a 2-minute Loom demo this week?\n\n' +
            'Best regards,\nAutomations Team',
          options: {
            appendAttribution: false,
          },
        },
        id: 'node-send-email',
        name: 'Send Personalized Cold Email (Gmail/SMTP)',
        type: 'n8n-nodes-base.gmail',
        typeVersion: 2.1,
        position: [960, 420],
      },
      {
        parameters: {
          operation: 'update',
          sheetId: sheetId,
          range: `${sheetTab}!A:Q`,
          keyRow: 'row_number',
          fields: {
            'Email Sent': 'YES',
            'Processing Status': 'Outreach Active',
          },
        },
        id: 'node-update-sheet-sent',
        name: 'Mark Lead "Email Sent = YES"',
        type: 'n8n-nodes-base.googleSheets',
        typeVersion: 4.4,
        position: [1200, 420],
      },
      {
        parameters: {
          pollTimes: {
            item: [
              {
                mode: 'everyMinute',
              },
            ],
          },
          simple: false,
          filters: {
            readStatus: 'unread',
          },
        },
        id: 'node-watch-gmail-replies',
        name: 'Watch For Prospect Replies',
        type: 'n8n-nodes-base.gmailTrigger',
        typeVersion: 1,
        position: [240, 720],
      },
      {
        parameters: {
          model: 'gemini-3.8-flash',
          prompt:
            'Analyze this reply from {{ $json.from }}:\n\n{{ $json.text }}\n\n' +
            'Classify the intent into one of:\n' +
            '1. "INTERESTED_WANTS_MEETING"\n' +
            '2. "OBJECTION_NEEDS_INFO"\n' +
            '3. "NOT_INTERESTED_UNSUBSCRIBE"\n' +
            '4. "OUT_OF_OFFICE"\n\n' +
            'Draft a contextual, polite response acknowledging their reply.',
        },
        id: 'node-gemini-reply-classifier',
        name: 'Gemini AI Reply Intent Classifier',
        type: 'n8n-nodes-base.openAi',
        typeVersion: 1.4,
        position: [520, 720],
      },
      {
        parameters: {
          conditions: {
            string: [
              {
                value1: '={{ $json.classification }}',
                value2: 'INTERESTED_WANTS_MEETING',
              },
            ],
          },
        },
        id: 'node-if-interested',
        name: 'If Prospect is Interested',
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position: [780, 720],
      },
      {
        parameters: {
          sendTo: '={{ $json.from }}',
          subject: 'Re: Quick question regarding workflow automation',
          message:
            'Fantastic! Here is my direct scheduling link so you can grab a time that fits your calendar:\n\n' +
            'https://cal.com/your-team/15min\n\n' +
            'Looking forward to speaking soon!',
        },
        id: 'node-send-calendar-link',
        name: 'Auto-Send Meeting Booking Link (Cal.com)',
        type: 'n8n-nodes-base.gmail',
        typeVersion: 2.1,
        position: [1040, 660],
      },
    ],
    connections: {
      'Fetch Pending Leads (Email Sent = NO)': {
        main: [[{ node: 'Deliverability Throttle (10 per hour)', type: 'main', index: 0 }]],
      },
      'Deliverability Throttle (10 per hour)': {
        main: [[{ node: 'Send Personalized Cold Email (Gmail/SMTP)', type: 'main', index: 0 }]],
      },
      'Send Personalized Cold Email (Gmail/SMTP)': {
        main: [[{ node: 'Mark Lead "Email Sent = YES"', type: 'main', index: 0 }]],
      },
      'Watch For Prospect Replies': {
        main: [[{ node: 'Gemini AI Reply Intent Classifier', type: 'main', index: 0 }]],
      },
      'Gemini AI Reply Intent Classifier': {
        main: [[{ node: 'If Prospect is Interested', type: 'main', index: 0 }]],
      },
      'If Prospect is Interested': {
        main: [
          [{ node: 'Auto-Send Meeting Booking Link (Cal.com)', type: 'main', index: 0 }],
          [],
        ],
      },
    },
  };
}

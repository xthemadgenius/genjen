import { Router, Request, Response } from 'express';
import { isSupabaseEnabled, getSupabaseClient } from '../utils/supabaseClient';
import { isPostgresEnabled, postgresQuery } from '../utils/postgresClient';
import { inMemoryUsers } from '../controllers/userController';
import { DUMMY_USERS, DUMMY_MEMBERSHIPS, DUMMY_DATA_STATS, BASE_CHAIN } from '../data/dummyData';
import { BASE_CHAIN as MODEL_BASE_CHAIN } from '../models/User';
import os from 'os';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    const getDatabaseMode = () => {
      if (isSupabaseEnabled()) return 'supabase';
      if (isPostgresEnabled()) return 'postgres';
      return 'in-memory';
    };

    const dbMode = getDatabaseMode();
    
    // Get database connection status
    const getDatabaseStatus = async () => {
      try {
        if (dbMode === 'supabase') {
          const supabase = getSupabaseClient();
          if (!supabase) return { connected: false, error: 'Supabase client not available' };
          
          const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
          if (error) return { connected: false, error: error.message };
          
          return { 
            connected: true, 
            userCount: data?.length || 0,
            tables: ['users', 'memberships']
          };
        } else if (dbMode === 'postgres') {
          const result = await postgresQuery('SELECT COUNT(*) as user_count FROM users');
          const membershipResult = await postgresQuery('SELECT COUNT(*) as membership_count FROM memberships');
          
          return { 
            connected: true,
            userCount: parseInt(result.rows[0].user_count),
            membershipCount: parseInt(membershipResult.rows[0].membership_count),
            tables: ['users', 'memberships']
          };
        } else {
          return { 
            connected: true, 
            userCount: inMemoryUsers.length,
            membershipCount: DUMMY_MEMBERSHIPS.length,
            mode: 'in-memory',
            dummyDataStats: DUMMY_DATA_STATS
          };
        }
      } catch (error) {
        return { 
          connected: false, 
          error: error instanceof Error ? error.message : 'Unknown database error' 
        };
      }
    };

    const databaseStatus = await getDatabaseStatus();

    // System information
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
      cpus: os.cpus().length,
      hostname: os.hostname(),
      loadAverage: os.loadavg()
    };

    // Process information
    const processInfo = {
      pid: process.pid,
      uptime: Math.round(process.uptime()),
      uptimeFormatted: formatUptime(process.uptime()),
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(process.memoryUsage().external / 1024 / 1024)} MB`
      }
    };

    // API endpoints information
    const apiInfo = {
      baseUrl: `http://localhost:${process.env.PORT || 4000}`,
      endpoints: {
        health: '/api/health',
        users: '/api/users',
        register: '/api/users/register',
        generateWallet: '/api/users/:id/generate-wallet',
        memberships: '/api/memberships'
      },
      cors: {
        enabled: true,
        origin: process.env.FRONTEND_URL || 'http://localhost:3000'
      }
    };

    // Blockchain information
    const blockchainInfo = {
      network: BASE_CHAIN.name,
      chainId: BASE_CHAIN.chainId,
      rpcUrl: BASE_CHAIN.rpcUrl,
      blockExplorer: BASE_CHAIN.blockExplorer,
      walletGeneration: 'WalletConnect/Reown',
      registrationFlow: 'email-first'
    };

    const healthStatus = {
      status: databaseStatus.connected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        mode: dbMode,
        status: databaseStatus
      },
      system: systemInfo,
      process: processInfo,
      api: apiInfo,
      blockchain: blockchainInfo,
      features: {
        emailFirstRegistration: true,
        generatedWallets: true,
        membershipTiers: DUMMY_MEMBERSHIPS.length,
        tripleDatabase: true,
        baseBlockchain: true
      }
    };

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      database: {
        mode: 'unknown',
        status: { connected: false, error: 'Health check error' }
      }
    });
  }
});

// Helper function to format uptime
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

// HTML table view of health status
router.get('/health/table', async (req: Request, res: Response) => {
  try {
    const getDatabaseMode = () => {
      if (isSupabaseEnabled()) return 'supabase';
      if (isPostgresEnabled()) return 'postgres';
      return 'in-memory';
    };

    const dbMode = getDatabaseMode();
    
    // Get database connection status (reuse the same logic)
    const getDatabaseStatus = async () => {
      try {
        if (dbMode === 'supabase') {
          const supabase = getSupabaseClient();
          if (!supabase) return { connected: false, error: 'Supabase client not available' };
          
          const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
          if (error) return { connected: false, error: error.message };
          
          return { 
            connected: true, 
            userCount: data?.length || 0,
            membershipCount: 'N/A',
            tables: ['users', 'memberships']
          };
        } else if (dbMode === 'postgres') {
          const result = await postgresQuery('SELECT COUNT(*) as user_count FROM users');
          const membershipResult = await postgresQuery('SELECT COUNT(*) as membership_count FROM memberships');
          
          return { 
            connected: true,
            userCount: parseInt(result.rows[0].user_count),
            membershipCount: parseInt(membershipResult.rows[0].membership_count),
            tables: ['users', 'memberships']
          };
        } else {
          return { 
            connected: true, 
            userCount: inMemoryUsers.length,
            membershipCount: DUMMY_MEMBERSHIPS.length,
            mode: 'in-memory'
          };
        }
      } catch (error) {
        return { 
          connected: false, 
          error: error instanceof Error ? error.message : 'Unknown database error' 
        };
      }
    };

    const databaseStatus = await getDatabaseStatus();
    const uptime = process.uptime();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Health Status</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: ${databaseStatus.connected ? '#10b981' : '#ef4444'};
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            background: rgba(255,255,255,0.2);
            margin-top: 8px;
        }
        .section {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section h2 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 18px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        tr:hover {
            background-color: #f9fafb;
        }
        .status-ok {
            color: #10b981;
            font-weight: bold;
        }
        .status-error {
            color: #ef4444;
            font-weight: bold;
        }
        .metric-value {
            font-weight: 600;
            color: #1f2937;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .card {
            background: #f9fafb;
            border-radius: 6px;
            padding: 15px;
        }
        .card h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 16px;
        }
        .endpoint-list {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }
        .endpoint-list li {
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .endpoint-list li:last-child {
            border-bottom: none;
        }
        .refresh-info {
            text-align: center;
            padding: 15px;
            background: #f3f4f6;
            color: #6b7280;
            font-size: 14px;
        }
        .timestamp {
            font-family: monospace;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Backend Health Status</h1>
            <div class="status-badge">
                ${databaseStatus.connected ? '✅ HEALTHY' : '❌ DEGRADED'}
            </div>
            <div class="timestamp">Last Updated: ${new Date().toISOString()}</div>
        </div>

        <div class="section">
            <h2>📊 System Overview</h2>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Server Status</td>
                    <td class="${databaseStatus.connected ? 'status-ok' : 'status-error'}">
                        ${databaseStatus.connected ? 'Healthy' : 'Degraded'}
                    </td>
                </tr>
                <tr>
                    <td>Environment</td>
                    <td class="metric-value">${process.env.NODE_ENV || 'development'}</td>
                </tr>
                <tr>
                    <td>Uptime</td>
                    <td class="metric-value">${formatUptime(uptime)}</td>
                </tr>
                <tr>
                    <td>Platform</td>
                    <td class="metric-value">${os.platform()} (${os.arch()})</td>
                </tr>
                <tr>
                    <td>Node.js Version</td>
                    <td class="metric-value">${process.version}</td>
                </tr>
                <tr>
                    <td>Process ID</td>
                    <td class="metric-value">${process.pid}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>💾 Database Status</h2>
            <table>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Database Mode</td>
                    <td class="metric-value">${dbMode.toUpperCase()}</td>
                </tr>
                <tr>
                    <td>Connection Status</td>
                    <td class="${databaseStatus.connected ? 'status-ok' : 'status-error'}">
                        ${databaseStatus.connected ? '✅ Connected' : `❌ Error: ${databaseStatus.error}`}
                    </td>
                </tr>
                <tr>
                    <td>Users Count</td>
                    <td class="metric-value">${databaseStatus.userCount || 0}</td>
                </tr>
                <tr>
                    <td>Memberships Count</td>
                    <td class="metric-value">${databaseStatus.membershipCount || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>🔗 Blockchain Configuration</h2>
            <table>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Network</td>
                    <td class="metric-value">${BASE_CHAIN.name}</td>
                </tr>
                <tr>
                    <td>Chain ID</td>
                    <td class="metric-value">${BASE_CHAIN.chainId}</td>
                </tr>
                <tr>
                    <td>RPC URL</td>
                    <td class="metric-value">${BASE_CHAIN.rpcUrl}</td>
                </tr>
                <tr>
                    <td>Block Explorer</td>
                    <td class="metric-value"><a href="${BASE_CHAIN.blockExplorer}" target="_blank">${BASE_CHAIN.blockExplorer}</a></td>
                </tr>
                <tr>
                    <td>Wallet Generation</td>
                    <td class="metric-value">WalletConnect/Reown</td>
                </tr>
                <tr>
                    <td>Registration Flow</td>
                    <td class="metric-value">Email-First</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="grid">
                <div class="card">
                    <h3>🔧 API Endpoints</h3>
                    <ul class="endpoint-list">
                        <li><strong>GET</strong> /api/health</li>
                        <li><strong>GET</strong> /api/health/table</li>
                        <li><strong>GET</strong> /api/users</li>
                        <li><strong>POST</strong> /api/users/register</li>
                        <li><strong>POST</strong> /api/users/:id/generate-wallet</li>
                        <li><strong>GET</strong> /api/memberships</li>
                    </ul>
                </div>

                <div class="card">
                    <h3>💻 Memory Usage</h3>
                    <table style="font-size: 14px;">
                        <tr>
                            <td>RSS</td>
                            <td class="metric-value">${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB</td>
                        </tr>
                        <tr>
                            <td>Heap Used</td>
                            <td class="metric-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</td>
                        </tr>
                        <tr>
                            <td>Heap Total</td>
                            <td class="metric-value">${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB</td>
                        </tr>
                        <tr>
                            <td>External</td>
                            <td class="metric-value">${Math.round(process.memoryUsage().external / 1024 / 1024)} MB</td>
                        </tr>
                    </table>
                </div>

                <div class="card">
                    <h3>⚡ Features</h3>
                    <ul class="endpoint-list">
                        <li>✅ Email-First Registration</li>
                        <li>✅ Generated Wallets</li>
                        <li>✅ ${DUMMY_MEMBERSHIPS.length} Membership Tiers</li>
                        <li>✅ Triple Database Support</li>
                        <li>✅ Base Blockchain</li>
                        <li>✅ CORS Enabled</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="refresh-info">
            🔄 This page auto-refreshes every 30 seconds | 
            <a href="/api/health">View JSON</a> | 
            <a href="/api/health/table">Refresh Table</a>
        </div>
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html>`;

    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).set('Content-Type', 'text/html').send(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: red;">❌ Health Check Error</h1>
          <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p><a href="/api/health">Try JSON endpoint</a></p>
        </body>
      </html>
    `);
  }
});

export default router;
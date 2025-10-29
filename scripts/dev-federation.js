#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Module configurations
const modules = [
  {
    name: 'host',
    port: 4200,
    color: colors.blue,
    description: 'Host Application (Main Shell)',
  },
  {
    name: 'autofactura',
    port: 4201,
    color: colors.green,
    description: 'Autofactura Module',
  },
  {
    name: 'gastos',
    port: 4202,
    color: colors.yellow,
    description: 'Gastos Module',
  },
  {
    name: 'proveedores',
    port: 4203,
    color: colors.magenta,
    description: 'Proveedores Module',
  },
];

// Function to create colored output
function coloredLog(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

// Function to start a module
function startModule(module) {
  return new Promise((resolve, reject) => {
    coloredLog(colors.cyan, `\n🚀 Starting ${module.name} on port ${module.port}...`);

    const child = spawn('npx', ['nx', 'serve', module.name], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    // Store reference to child process
    module.process = child;

    // Handle stdout
    child.stdout.on('data', (data) => {
      const output = data.toString();
      coloredLog(module.color, `[${module.name.toUpperCase()}] ${output.trim()}`);
    });

    // Handle stderr
    child.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:')) {
        coloredLog(module.color, `[${module.name.toUpperCase()}] ${output.trim()}`);
      } else if (output.includes('error') || output.includes('Error')) {
        coloredLog(colors.red, `[${module.name.toUpperCase()}] ERROR: ${output.trim()}`);
      }
    });

    // Handle process exit
    child.on('exit', (code) => {
      if (code !== 0) {
        coloredLog(colors.red, `❌ ${module.name} exited with code ${code}`);
        reject(new Error(`${module.name} failed to start`));
      }
    });

    // Wait for module to be ready
    child.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') && output.includes(`:${module.port}`)) {
        coloredLog(colors.green, `✅ ${module.name} is ready at http://localhost:${module.port}`);
        resolve();
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      coloredLog(colors.yellow, `⏰ Timeout waiting for ${module.name} to start`);
      resolve();
    }, 30000);
  });
}

// Function to stop all modules
function stopAllModules() {
  coloredLog(colors.yellow, '\n🛑 Stopping all modules...');

  modules.forEach(module => {
    if (module.process) {
      module.process.kill('SIGTERM');
      coloredLog(module.color, `Stopped ${module.name}`);
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  coloredLog(colors.yellow, '\n\n🛑 Received SIGINT, shutting down gracefully...');
  stopAllModules();
  process.exit(0);
});

process.on('SIGTERM', () => {
  coloredLog(colors.yellow, '\n\n🛑 Received SIGTERM, shutting down gracefully...');
  stopAllModules();
  process.exit(0);
});

// Main function
async function main() {
  coloredLog(colors.bright, '🎯 Rfacil ERP - Module Federation Development Server');
  coloredLog(colors.cyan, '==================================================');

  // Display module information
  coloredLog(colors.bright, '\n📋 Module Configuration:');
  modules.forEach(module => {
    coloredLog(module.color, `  • ${module.name}: http://localhost:${module.port} - ${module.description}`);
  });

  coloredLog(colors.bright, '\n🚀 Starting modules...');
  coloredLog(colors.yellow, 'Note: It may take a few minutes for all modules to be ready.');
  coloredLog(colors.yellow, 'Press Ctrl+C to stop all modules.\n');

  try {
    // Start all modules in parallel
    await Promise.all(modules.map(module => startModule(module)));

    coloredLog(colors.green, '\n🎉 All modules are ready!');
    coloredLog(colors.bright, '\n📱 Access your applications:');
    coloredLog(colors.blue, `  • Host Application: http://localhost:4200`);
    coloredLog(colors.green, `  • Autofactura Module: http://localhost:4201`);
    coloredLog(colors.yellow, `  • Gastos Module: http://localhost:4202`);
    coloredLog(colors.magenta, `  • Proveedores Module: http://localhost:4203`);

    coloredLog(colors.bright, '\n💡 Tips:');
    coloredLog(colors.cyan, '  • Use the Host Application (port 4200) to access all modules');
    coloredLog(colors.cyan, '  • Individual modules can be accessed directly for development');
    coloredLog(colors.cyan, '  • Hot reload is enabled for all modules');
    coloredLog(colors.cyan, '  • Module Federation allows independent development and deployment');

    coloredLog(colors.yellow, '\n⚠️  Keep this terminal open while developing.');
    coloredLog(colors.yellow, 'Press Ctrl+C to stop all modules when done.\n');

  } catch (error) {
    coloredLog(colors.red, `\n❌ Error starting modules: ${error.message}`);
    stopAllModules();
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  coloredLog(colors.red, `\n💥 Unexpected error: ${error.message}`);
  stopAllModules();
  process.exit(1);
});

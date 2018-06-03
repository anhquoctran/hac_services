module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
	apps : [

		// First application
		{
			name      : 'HueicAccessControlServices',
			script    : 'bin/www',
			env: {
				COMMON_VARIABLE: 'true'
			},
			ignore_watch : ["node_modules", "public", ".vscode", "view", ".gitigore", "bin/public"],
			watch: true,
			env_production : {
				NODE_ENV: 'development'
			}
		}
	],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
	deploy : {
		dev : {
			user : 'node',
			host : '0.0.0.0',
			ref  : 'origin/master',
			repo : 'git@github.com:repo.git',
			path : '/bin/www/',
			'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
			env  : {
				NODE_ENV: 'dev'
			}
		}
  	}
};

"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[941],{4137:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),g=r,d=u["".concat(l,".").concat(g)]||u[g]||m[g]||o;return n?a.createElement(d,i(i({ref:t},p),{},{components:n})):a.createElement(d,i({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=g;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},9285:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(4137));const o={title:"Training an Agent",sidebar_position:1},i="Training an Agent",s={unversionedId:"Rocket League/training_an_agent",id:"Rocket League/training_an_agent",title:"Training an Agent",description:"This guide builds on our Quick Start Guide to help you train a more sophisticated Rocket League bot than the simple setup in the quickstart guide. We'll use RocketSim to run training much faster than the actual game, and cover all the key concepts you need to know.",source:"@site/docs/Rocket League/training_an_agent.md",sourceDirName:"Rocket League",slug:"/Rocket League/training_an_agent",permalink:"/Rocket League/training_an_agent",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Training an Agent",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Quick Start Guide",permalink:"/Getting Started/quickstart"},next:{title:"Action Parsers",permalink:"/Rocket League/Configuration Objects/action_parsers"}},l={},c=[{value:"A Better Agent",id:"a-better-agent",level:2},{value:"Understanding the Training Process",id:"understanding-the-training-process",level:2},{value:"Monitoring Progress",id:"monitoring-progress",level:2}],p={toc:c},u="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"training-an-agent"},"Training an Agent"),(0,r.kt)("p",null,"This guide builds on our ",(0,r.kt)("a",{parentName:"p",href:"../Getting%20Started/quickstart"},"Quick Start Guide")," to help you train a more sophisticated Rocket League bot than the simple setup in the quickstart guide. We'll use RocketSim to run training much faster than the actual game, and cover all the key concepts you need to know."),(0,r.kt)("p",null,"his tutorial is adapted from an excellent guide written by Zealan, the creator of RocketSim. You can find the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/ZealanL/RLGym-PPO-Guide/tree/main"},"original tutorial here")," for even more details."),(0,r.kt)("h2",{id:"a-better-agent"},"A Better Agent"),(0,r.kt)("p",null,"We'll start off this by first creating a richer reward function so our agent has an easier time learning what to do. Then we'll adjust the PPO hyperparameters, and finally set up a visualizer so we can watch our agent learn."),(0,r.kt)("p",null,"First you'll need to make sure you have RLGym installed with RLViser support (unless you are using a different visualizer, in which case you can skip this step):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pip install rlgym[rl-rlviser]\n")),(0,r.kt)("p",null,"Now let's make a few custom reward functions to help our agent out. It's best to move these to a separate file from the main script and then import them when making the environment, but you can put them wherever you like."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'from typing import List, Dict, Any\nfrom rlgym.api import RewardFunction\nfrom rlgym.rocket_league.api import GameState, AgentID\nfrom rlgym.rocket_league import common_values\nimport numpy as np\n\nclass SpeedTowardBallReward(RewardFunction[AgentID, GameState, float]):\n    """Rewards the agent for moving quickly toward the ball"""\n    \n    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:\n        pass\n    \n    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],\n                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:\n        rewards = {}\n        for agent in agents:\n            car = state.cars[agent]\n            car_physics = car.physics if car.is_orange else car.inverted_physics\n            ball_physics = state.ball if car.is_orange else state.inverted_ball\n            player_vel = car_physics.linear_velocity\n            pos_diff = (ball_physics.position - car_physics.position)\n            dist_to_ball = np.linalg.norm(pos_diff)\n            dir_to_ball = pos_diff / dist_to_ball\n\n            speed_toward_ball = np.dot(player_vel, dir_to_ball)\n\n            rewards[agent] = max(speed_toward_ball / common_values.CAR_MAX_SPEED, 0.0)\n        return rewards\n\nclass InAirReward(RewardFunction[AgentID, GameState, float]):\n    """Rewards the agent for being in the air"""\n    \n    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:\n        pass\n    \n    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],\n                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:\n        return {agent: float(not state.cars[agent].on_ground) for agent in agents}\n\nclass VelocityBallToGoalReward(RewardFunction[AgentID, GameState, float]):\n    """Rewards the agent for hitting the ball toward the opponent\'s goal"""\n    \n    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:\n        pass\n    \n    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],\n                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:\n        rewards = {}\n        for agent in agents:\n            car = state.cars[agent]\n            if car.is_orange:\n                ball = state.ball\n                goal_y = common_values.BACK_NET_Y\n            else:\n                ball = state.inverted_ball\n                goal_y = -common_values.BACK_NET_Y\n\n            ball_vel = ball.linear_velocity\n            pos_diff = np.array([0, goal_y, 0]) - ball.position\n            dist = np.linalg.norm(pos_diff)\n            dir_to_goal = pos_diff / dist\n            \n            vel_toward_goal = np.dot(ball_vel, dir_to_goal)\n            rewards[agent] = max(vel_toward_goal / common_values.BALL_MAX_SPEED, 0)\n        return rewards\n')),(0,r.kt)("p",null,"Now that we've got our rewards, we can set up the environment:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"def build_rlgym_v2_env():\n    import numpy as np\n    from rlgym.api import RLGym\n    from rlgym.rocket_league.action_parsers import LookupTableAction, RepeatAction\n    from rlgym.rocket_league.done_conditions import GoalCondition, NoTouchTimeoutCondition, TimeoutCondition, AnyCondition\n    from rlgym.rocket_league.obs_builders import DefaultObs\n    from rlgym.rocket_league.reward_functions import CombinedReward, GoalReward\n    from rlgym.rocket_league.sim import RocketSimEngine\n    from rlgym.rocket_league.state_mutators import MutatorSequence, FixedTeamSizeMutator, KickoffMutator\n    from rlgym.rocket_league import common_values\n    from rlgym_ppo.util import RLGymV2GymWrapper\n\n    spawn_opponents = True\n    team_size = 1\n    blue_team_size = team_size\n    orange_team_size = team_size if spawn_opponents else 0\n    action_repeat = 8\n    no_touch_timeout_seconds = 30\n    game_timeout_seconds = 300\n\n    action_parser = RepeatAction(LookupTableAction(), repeats=action_repeat)\n    termination_condition = GoalCondition()\n    truncation_condition = AnyCondition(\n        NoTouchTimeoutCondition(timeout_seconds=no_touch_timeout_seconds),\n        TimeoutCondition(timeout_seconds=game_timeout_seconds)\n    )\n\n    reward_fn = CombinedReward(\n        (InAirReward(), 0.002),\n        (SpeedTowardBallReward(), 0.01),\n        (VelocityBallToGoalReward(), 0.1),\n        (GoalReward(), 10.0)\n    )\n\n    obs_builder = DefaultObs(zero_padding=None,\n                           pos_coef=np.asarray([1 / common_values.SIDE_WALL_X, \n                                              1 / common_values.BACK_NET_Y, \n                                              1 / common_values.CEILING_Z]),\n                           ang_coef=1 / np.pi,\n                           lin_vel_coef=1 / common_values.CAR_MAX_SPEED,\n                           ang_vel_coef=1 / common_values.CAR_MAX_ANG_VEL,\n                           boost_coef=1 / 100.0)\n\n    state_mutator = MutatorSequence(\n        FixedTeamSizeMutator(blue_size=blue_team_size, orange_size=orange_team_size),\n        KickoffMutator()\n    )\n\n    rlgym_env = RLGym(\n        state_mutator=state_mutator,\n        obs_builder=obs_builder,\n        action_parser=action_parser,\n        reward_fn=reward_fn,\n        termination_cond=termination_condition,\n        truncation_cond=truncation_condition,\n        transition_engine=RocketSimEngine()\n    )\n\n    return RLGymV2GymWrapper(rlgym_env)\n\n\nif __name__ == \"__main__\":\n    from rlgym_ppo import Learner\n\n    # 32 processes\n    n_proc = 32\n\n    # educated guess - could be slightly higher or lower\n    min_inference_size = max(1, int(round(n_proc * 0.9)))\n\n    learner = Learner(build_rlgym_v2_env,\n                      n_proc=n_proc,\n                      min_inference_size=min_inference_size,\n                      metrics_logger=None, # Leave this empty for now.\n                      ppo_batch_size=100_000,  # batch size - much higher than 300K doesn't seem to help most people\n                      policy_layer_sizes=[2048, 2048, 1024, 1024],  # policy network\n                      critic_layer_sizes=[2048, 2048, 1024, 1024],  # critic network\n                      ts_per_iteration=100_000,  # timesteps per training iteration - set this equal to the batch size\n                      exp_buffer_size=300_000,  # size of experience buffer - keep this 2 - 3x the batch size\n                      ppo_minibatch_size=50_000,  # minibatch size - set this as high as your GPU can handle\n                      ppo_ent_coef=0.01,  # entropy coefficient - this determines the impact of exploration\n                      policy_lr=1e-4,  # policy learning rate\n                      critic_lr=1e-4,  # critic learning rate\n                      ppo_epochs=2,   # number of PPO epochs\n                      standardize_returns=True, # Don't touch these.\n                      standardize_obs=False, # Don't touch these.\n                      save_every_ts=1_000_000,  # save every 1M steps\n                      timestep_limit=1_000_000_000,  # Train for 1B steps\n                      log_to_wandb=False # Set this to True if you want to use Weights & Biases for logging.\n                      ) \n    learner.learn()\n")),(0,r.kt)("h2",{id:"understanding-the-training-process"},"Understanding the Training Process"),(0,r.kt)("p",null,"Let's break down how PPO training works. The process happens in cycles:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Collecting Experience"),": Your agent plays games in RocketSim, trying different actions to learn what works. Each time it acts, the game advances 8 physics ticks (that's one timestep), and the environment tells the agent what happened (by showing it a new observation) and how well it did (by giving it a reward).")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Learning"),": After collecting enough timesteps, PPO uses all that experience to improve your agent's neural network. It adjusts the network to make good actions (ones that led to high rewards) more likely and bad actions less likely."))),(0,r.kt)("p",null,"When you run the training, you'll see a bunch of metrics like these in the console after each cycle:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Policy Reward"),": The average reward per episode - higher means your agent is doing better"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Policy Entropy"),": How much your agent is exploring - this should settle around 2"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Collected Steps Per Second"),": How fast your agent is gathering experience - higher is better"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Consumed Steps Per Second"),": How fast your agent is learning from that experience - higher is better")),(0,r.kt)("h2",{id:"monitoring-progress"},"Monitoring Progress"),(0,r.kt)("p",null,"RLGym-PPO has integrated support for ",(0,r.kt)("a",{parentName:"p",href:"https://wandb.ai"},"Weights & Biases")," (wandb) for tracking training metrics. Once you set up an account with wandb and install the Python package via ",(0,r.kt)("inlineCode",{parentName:"p"},"pip install wandb"),", set the ",(0,r.kt)("inlineCode",{parentName:"p"},"log_to_wandb")," parameter to ",(0,r.kt)("inlineCode",{parentName:"p"},"True")," in the ",(0,r.kt)("inlineCode",{parentName:"p"},"Learner")," constructor. Then you can view your training progress in the web interface. You'll see graphs of rewards, losses, and other statistics that help you understand how your bot is improving."))}m.isMDXComponent=!0}}]);
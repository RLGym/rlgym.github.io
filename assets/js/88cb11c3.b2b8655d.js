"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[692],{4137:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>b});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),g=r,b=u["".concat(l,".").concat(g)]||u[g]||d[g]||i;return n?a.createElement(b,o(o({ref:t},p),{},{components:n})):a.createElement(b,o({ref:t},p))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},4632:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(4137));const i={title:"Observation Builders"},o="Observation Builders",s={unversionedId:"Rocket League/Configuration Objects/observation_builders",id:"Rocket League/Configuration Objects/observation_builders",title:"Observation Builders",description:"An ObsBuilder is an object used by RLGym to transform a GameState from the transition engine into inputs for each",source:"@site/docs/Rocket League/Configuration Objects/observation_builders.md",sourceDirName:"Rocket League/Configuration Objects",slug:"/Rocket League/Configuration Objects/observation_builders",permalink:"/Rocket League/Configuration Objects/observation_builders",draft:!1,tags:[],version:"current",frontMatter:{title:"Observation Builders"},sidebar:"tutorialSidebar",previous:{title:"Done Conditions",permalink:"/Rocket League/Configuration Objects/done_conditions"},next:{title:"Renderers",permalink:"/Rocket League/Configuration Objects/renderers"}},l={},c=[{value:"Example",id:"example",level:2},{value:"Understanding Perspective",id:"understanding-perspective",level:2}],p={toc:c},u="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"observation-builders"},"Observation Builders"),(0,r.kt)("p",null,"An ",(0,r.kt)("inlineCode",{parentName:"p"},"ObsBuilder")," is an object used by RLGym to transform a ",(0,r.kt)("inlineCode",{parentName:"p"},"GameState")," from the transition engine into inputs for each\nagent at every step. An observation builder is expected to build one observation per agent in the environment."),(0,r.kt)("p",null,"To make your own observation builder, you'll need three methods:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"# This tells your learning algorithm what kind of observations to expect\ndef get_obs_space(self, agent: AgentID) -> ObsSpaceType:\n    \n# Called every time `TransitionEngine.create_base_state()` is called.\ndef reset(self, agents: List[AgentID], initial_state: StateType, shared_info: Dict[str, Any]) -> None:\n\n# Called every time `TransitionEngine.step()` or `TransitionEngine.create_base_state()` is called.\ndef build_obs(self, agents: List[AgentID], state: StateType, shared_info: Dict[str, Any]) -> Dict[AgentID, ObsType]:\n")),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("p",null,"Let's create a simple observation builder that lets each agent see its own physics state (position, velocity, etc.) and the ball's physics state. Here's how we do it:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"from rlgym.api import ObsBuilder, AgentID\nfrom rlgym.rocket_league.api import Car, GameState\nfrom typing import List, Dict, Any, Tuple\nimport numpy as np\n\n\nclass CustomObsBuilder(ObsBuilder):\n    def get_obs_space(self, agent: AgentID) -> Tuple[str, int]:\n        # Each observation will have 24 numbers (physics data for car and ball)\n        return 'real', 24\n    \n    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:\n        pass\n\n    def build_obs(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, np.ndarray]:\n        obs = {}\n        \n        # Build an observation for each agent\n        for agent in agents:\n            obs[agent] = self._build_obs(agent, state, shared_info)\n        \n        return obs\n    \n    def _build_obs(self, agent: AgentID, state: GameState, shared_info: Dict[str, Any]) -> np.ndarray:\n        # Here we build an observation for a single agent.\n        agent_physics_state = state.cars[agent].physics\n        ball = state.ball\n        \n        agent_obs = [\n            # Ball physics data.\n            ball.position,\n            ball.linear_velocity,\n            ball.angular_velocity,\n            \n            # Agent physics data. Forward and up vectors are used because they fully specify the orientation of the car.\n            agent_physics_state.position,\n            agent_physics_state.forward,\n            agent_physics_state.up,\n            agent_physics_state.linear_velocity,\n            agent_physics_state.angular_velocity\n        ]\n        \n        return np.concatenate(agent_obs)\n")),(0,r.kt)("p",null,"Now we can provide an instance of our ",(0,r.kt)("inlineCode",{parentName:"p"},"CustomObsBuilder")," to an RLGym environment whenever we make one!"),(0,r.kt)("h2",{id:"understanding-perspective"},"Understanding Perspective"),(0,r.kt)("p",null,"If we tried to train an agent to play the game using the observation builder in the above example won't get us very far\nfor a number of reasons. One of those is that our agents don't know what team they're on! To avoid re-learning the same\nstrategy on both sides of the pitch, it's often useful to transform the physics information for the agents and ball such\nthat agents always view the pitch from the perspective of a player on the orange team."),(0,r.kt)("p",null,"To do this, we'll check which team the agent is on before building an observation for it and when we find an agent on the\nblue team we will use the ",(0,r.kt)("inlineCode",{parentName:"p"},"inverted_physics")," property available in the ",(0,r.kt)("inlineCode",{parentName:"p"},"Car")," object. This will compute the inverted physics\ndata for that car if it has not yet been computed and return it to us."),(0,r.kt)("p",null,"Let's modify our above example to include the ",(0,r.kt)("inlineCode",{parentName:"p"},"inverted_physics")," object when appropriate."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"from rlgym.api import ObsBuilder, AgentID\nfrom rlgym.rocket_league.api import Car, GameState\nfrom rlgym.rocket_league.common_values import ORANGE_TEAM\nfrom typing import List, Dict, Any, Tuple\nimport numpy as np\n\n\nclass CustomObsBuilder(ObsBuilder):\n    def get_obs_space(self, agent: AgentID) -> Tuple[str, int]:\n        # Each observation will have 24 numbers (physics data for car and ball)\n        return 'real', 24\n    \n    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:\n        pass\n\n    def build_obs(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, np.ndarray]:\n        obs = {}\n        \n        # Build an observation for each agent\n        for agent in agents:\n            obs[agent] = self._build_obs(agent, state, shared_info)\n        \n        return obs\n    \n    def _build_obs(self, agent: AgentID, state: GameState, shared_info: Dict[str, Any]) -> np.ndarray:\n        # We will first grab the car that is being controlled by this agent.\n        car = state.cars[agent]\n        \n        # Then we'll check if this agent is on the orange team already.\n        if car.team_num == ORANGE_TEAM:\n            agent_physics_state = state.cars[agent].physics\n            ball = state.ball\n        else:\n            # If this agent isn't on the orange team we'll use the inverted physics information for both the car and the ball.\n            agent_physics_state = state.cars[agent].inverted_physics\n            ball = state.inverted_ball\n        \n        # The rest of the code can remain unchanged!\n        agent_obs = [\n            # Ball physics data.\n            ball.position,\n            ball.linear_velocity,\n            ball.angular_velocity,\n            \n            # Agent physics data. Forward and up vectors are used because they fully specify the orientation of the car.\n            agent_physics_state.position,\n            agent_physics_state.forward,\n            agent_physics_state.up,\n            agent_physics_state.linear_velocity,\n            agent_physics_state.angular_velocity\n        ]\n        \n        return np.concatenate(agent_obs)\n")),(0,r.kt)("p",null,"Now our agents will always think they're playing on the orange side of the pitch!"),(0,r.kt)("p",null,"While these ",(0,r.kt)("inlineCode",{parentName:"p"},"ObsBuilder")," examples won't crash if provided to an RLGym environment, they lack a lot of information that\nan effective game-playing agent would need to know about. If you're looking for a more complete example, check out the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/lucas-emery/rocket-league-gym/blob/main/rlgym/rocket_league/obs_builders/default_obs.py"},"default observation builder")," provided by RLGym!"))}d.isMDXComponent=!0}}]);
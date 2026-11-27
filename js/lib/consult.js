/* Needs-based AI PC consultation — pure recommendation logic, UMD */
(function (root) {
  'use strict';

  var USES = [
    {
      key: 'study',
      label: 'Learning, research & assignments',
      category: 'Study & research AI PC',
      ram: 16,
      storage: 512,
      focus: 'research tabs and assignment apps',
      capabilities: ['Document tools where supported', 'Study assistants with compatible apps', 'Photo and video edits, app-dependent']
    },
    {
      key: 'code',
      label: 'Coding & multitasking',
      category: 'Developer multitasking AI PC',
      ram: 32,
      storage: 1024,
      focus: 'your compilers, containers and development tools',
      capabilities: ['Code assistants that support your tools', 'Build and test multitasking, configuration-dependent', 'Containers or virtual machines, OS-dependent']
    },
    {
      key: 'create',
      label: 'Content creation & video editing',
      category: 'Creator AI PC',
      ram: 32,
      storage: 1024,
      focus: 'your media files and editing software',
      capabilities: ['Photo and video tools, app-dependent', 'Generative fill where supported', 'Export performance depends on the system']
    },
    {
      key: 'game',
      label: 'Gaming & entertainment',
      category: 'Gaming & entertainment AI PC',
      ram: 16,
      storage: 1024,
      focus: 'graphics performance and storage for game installs',
      capabilities: ['Game upscaling where supported', 'Streaming and overlays, app/GPU-dependent', 'Capture edits with compatible apps']
    },
    {
      key: 'business',
      label: 'Business & productivity',
      category: 'Business productivity AI PC',
      ram: 16,
      storage: 512,
      focus: 'your meeting and document apps',
      capabilities: ['Meeting and notes assistants with compatible apps', 'Document tools where supported', 'Battery life varies by laptop and use']
    }
  ];

  var PRIORITIES = [
    {
      key: 'battery',
      label: 'Battery life & portability',
      ram: 16,
      storage: 512,
      focus: 'efficiency first',
      capabilities: ['NPU support for sustained AI, where available', 'Portability-focused configuration; check battery tests']
    },
    {
      key: 'performance',
      label: 'Performance & multitasking',
      ram: 32,
      storage: 1024,
      focus: 'more headroom under load',
      capabilities: ['More memory for multitasking', 'Local AI performance depends on app and hardware support']
    },
    {
      key: 'ai',
      label: 'AI-powered creativity',
      ram: 32,
      storage: 1024,
      focus: 'local AI and creative headroom',
      capabilities: ['NPU acceleration in supported apps and models', 'Local creative tools where supported']
    },
    {
      key: 'longevity',
      label: 'Long-term usability',
      ram: 32,
      storage: 1024,
      focus: 'memory and storage headroom',
      capabilities: ['More memory for larger apps', 'More room for projects']
    },
    {
      key: 'value',
      label: 'Budget & value',
      ram: 16,
      storage: 512,
      focus: 'the right essentials, not the cheapest badge',
      capabilities: ['AI features supported by the selected model and apps', 'Balanced everyday use, device-dependent']
    }
  ];

  var OBJECTIONS = [
    {
      title: 'AI acceleration',
      body: 'An NPU is designed to accelerate supported AI workloads efficiently. The CPU and GPU can also run AI work, depending on the app.'
    },
    {
      title: 'Battery and heat',
      body: 'An NPU is designed for efficient supported AI workloads. Actual power use and battery life depend on the processor, laptop design and app; compare device battery tests.'
    },
    {
      title: 'Privacy options',
      body: 'Local processing can reduce the need to send selected data to cloud services. Check the app privacy settings you rely on.'
    },
    {
      title: 'Multitasking',
      body: 'More memory can help when demanding apps run together. Check the software requirements and whether the laptop memory can be upgraded.'
    },
    {
      title: 'Application compatibility',
      body: 'Intel Core Ultra runs Windows and a broad range of x86 apps. Verify the exact app and feature you need before buying.'
    },
    {
      title: 'Long-term fit',
      body: 'Buy for the work you do today and verified app support. No hardware is guaranteed to be future-proof.'
    }
  ];

  var COMPETITOR_NOTE = 'AMD Ryzen AI and Qualcomm Snapdragon X also offer NPUs. Compare the whole device — apps, battery, memory and price — for your workload.';

  var DISCLAIMER = 'Suggested starting point, not an available SKU. Ask the retailer to verify exact processor, NPU, app support, memory, storage and upgrade options.';

  function find(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function unique(list) {
    return list.filter(function (item, i) { return list.indexOf(item) === i; });
  }

  function recommend(answers) {
    var use = find(USES, answers && answers.use) || USES[0];
    var priority = find(PRIORITIES, answers && answers.priority) || PRIORITIES[0];
    var ramGB = Math.max(use.ram, priority.ram);
    var storageGB = Math.max(use.storage, priority.storage);
    var ram = ramGB + 'GB';
    var storage = storageGB >= 1024 ? '1TB SSD' : '512GB SSD';

    var capabilities = unique(use.capabilities.concat(priority.capabilities)).slice(0, 5);
    var processor = use.key === 'game'
      ? 'Check GPU against game requirements; NPU is not a graphics substitute'
      : use.key === 'create'
        ? 'Match CPU/GPU to editing software; verify NPU/app support'
        : use.key === 'code'
          ? 'Match CPU/OS to developer tools; verify NPU for AI features'
          : 'Intel Core Ultra mobile laptop — verify the exact model and NPU';
    var why = 'You chose ' + use.label.toLowerCase() + ', with ' + priority.label.toLowerCase()
      + ' as the priority. Consider this starting point for ' + use.focus + ', with ' + priority.focus
      + '. Confirm the exact laptop and app requirements with the retailer.';

    return {
      use: use.key,
      priority: priority.key,
      category: use.category,
      processor: processor,
      ram: ram,
      storage: storage,
      capabilities: capabilities,
      why: why,
      tradeoff: 'Check memory and storage upgrade options; some laptop components cannot be upgraded by the owner.',
      disclaimer: DISCLAIMER,
      competitorNote: COMPETITOR_NOTE,
      promise: 'Your next laptop should work as hard as you do.',
      objections: OBJECTIONS
    };
  }

  var api = {
    USES: USES,
    PRIORITIES: PRIORITIES,
    OBJECTIONS: OBJECTIONS,
    COMPETITOR_NOTE: COMPETITOR_NOTE,
    DISCLAIMER: DISCLAIMER,
    recommend: recommend
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.consult = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

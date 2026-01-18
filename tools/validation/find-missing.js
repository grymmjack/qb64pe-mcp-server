const fs = require('fs');

const allTools = [
  'analyze_qb64pe_execution_mode',
  'analyze_qb64pe_graphics_screenshot', 
  'analyze_qbasic_compatibility',
  'autocomplete_qb64pe_keywords',
  'capture_qb64pe_screenshot',
  'detect_qb64pe_installation',
  'enhance_qb64pe_code_for_debugging',
  'generate_advanced_debugging_template',
  'generate_console_formatting_template',
  'generate_monitoring_template',
  'generate_output_capture_commands',
  'generate_programming_feedback',
  'generate_qb64pe_echo_functions',
  'generate_qb64pe_installation_report',
  'generate_qb64pe_screenshot_analysis_template',
  'get_automation_status',
  'get_compiler_options',
  'get_debugging_help',
  'get_execution_monitoring_guidance',
  'get_feedback_statistics',
  'get_file_monitoring_commands',
  'get_llm_debugging_guide',
  'get_porting_dialect_info',
  'get_process_monitoring_commands',
  'get_programming_feedback_history',
  'get_qb64pe_best_practices',
  'get_qb64pe_debugging_best_practices',
  'get_qb64pe_graphics_guide',
  'get_qb64pe_installation_guidance',
  'get_qb64pe_keywords_by_category',
  'get_qb64pe_page',
  'get_qb64pe_path_configuration',
  'get_qb64pe_processes',
  'get_qb64pe_wiki_categories',
  'get_screenshot_analysis_history',
  'inject_native_qb64pe_logging',
  'lookup_qb64pe_keyword',
  'parse_console_output',
  'parse_qb64pe_structured_output',
  'port_qbasic_to_qb64pe',
  'search_qb64pe_compatibility',
  'search_qb64pe_keywords',
  'search_qb64pe_keywords_by_wiki_category',
  'search_qb64pe_wiki',
  'start_screenshot_monitoring',
  'start_screenshot_watching',
  'stop_screenshot_monitoring',
  'stop_screenshot_watching',
  'validate_qb64pe_compatibility',
  'validate_qb64pe_path',
  'validate_qb64pe_syntax'
];

const existingDocs = fs.readdirSync('tool-docs').filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));

const missing = allTools.filter(tool => !existingDocs.includes(tool));
console.log('Missing documentation:');
missing.forEach((tool, index) => console.log(`${index + 1}. ${tool}`));
console.log(`\nTotal missing: ${missing.length}`);
console.log(`Existing docs: ${existingDocs.length}`);
console.log(`Total tools: ${allTools.length}`);

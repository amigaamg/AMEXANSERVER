import { WithId, WithTimestamps } from './index';

export enum AnalyticsMetricType {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  PERCENTILE = 'percentile',
  RATE = 'rate',
  RATIO = 'ratio',
  DISTRIBUTION = 'distribution'
}

export enum AnalyticsDimension {
  TIME = 'time',
  USER = 'user',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  DEPARTMENT = 'department',
  LOCATION = 'location',
  DEVICE = 'device',
  BROWSER = 'browser',
  OS = 'os',
  COUNTRY = 'country',
  REGION = 'region',
  CITY = 'city',
  SOURCE = 'source',
  MEDIUM = 'medium',
  CAMPAIGN = 'campaign'
}

export enum AnalyticsGranularity {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum AnalyticsFilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_EQUALS = 'greater_than_equals',
  LESS_THAN_EQUALS = 'less_than_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
  NOT_BETWEEN = 'not_between'
}

export interface AnalyticsQuery {
  // Metrics
  metrics: AnalyticsMetric[];
  
  // Dimensions
  dimensions?: AnalyticsDimension[];
  
  // Filters
  filters?: AnalyticsFilter[];
  
  // Time Range
  timeRange: TimeRange;
  
  // Granularity
  granularity?: AnalyticsGranularity;
  
  // Sorting
  sort?: AnalyticsSort[];
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Format
  format?: 'json' | 'csv' | 'excel';
  
  // Metadata
  queryId?: string;
  userId?: string;
}

export interface AnalyticsMetric {
  name: string;
  type: AnalyticsMetricType;
  field?: string;
  alias?: string;
  parameters?: Record<string, any>;
}

export interface AnalyticsFilter {
  field: string;
  operator: AnalyticsFilterOperator;
  value: any;
  logical?: 'AND' | 'OR';
}

export interface TimeRange {
  start: Date;
  end: Date;
  timezone?: string;
}

export interface AnalyticsSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface AnalyticsResult {
  query: AnalyticsQuery;
  data: AnalyticsData[];
  summary: AnalyticsSummary;
  metadata: AnalyticsMetadata;
  execution: AnalyticsExecution;
}

export interface AnalyticsData {
  dimensions: Record<string, any>;
  metrics: Record<string, any>;
  timestamp?: Date;
}

export interface AnalyticsSummary {
  total: number;
  averages: Record<string, number>;
  minimums: Record<string, number>;
  maximums: Record<string, number>;
  percentiles: Record<string, Record<number, number>>;
}

export interface AnalyticsMetadata {
  generatedAt: Date;
  dataPoints: number;
  cacheHit: boolean;
  cacheKey?: string;
  queryHash: string;
}

export interface AnalyticsExecution {
  duration: number;
  queryPlan?: any;
  resourcesUsed: string[];
}

// Business Intelligence Dashboards
export interface Dashboard extends WithId, WithTimestamps {
  name: string;
  description?: string;
  category: string;
  tags: string[];
  
  // Layout
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  
  // Permissions
  permissions: DashboardPermissions;
  
  // Settings
  settings: DashboardSettings;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  version: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

export interface DashboardLayout {
  type: 'grid' | 'freeform' | 'responsive';
  columns: number;
  rowHeight: number;
  breakpoints?: Record<string, number>;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  
  // Position
  position: WidgetPosition;
  
  // Data
  dataSource: WidgetDataSource;
  refreshInterval?: number;
  
  // Configuration
  configuration: WidgetConfiguration;
  
  // Interactions
  interactions: WidgetInteraction[];
  
  // Styling
  styling: WidgetStyling;
}

export type WidgetType = 
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'area_chart'
  | 'scatter_plot'
  | 'heatmap'
  | 'table'
  | 'metric'
  | 'gauge'
  | 'progress'
  | 'treemap'
  | 'funnel'
  | 'map'
  | 'kpi'
  | 'text'
  | 'image';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface WidgetDataSource {
  type: 'query' | 'static' | 'api' | 'database';
  query?: AnalyticsQuery;
  staticData?: any;
  apiEndpoint?: string;
  databaseTable?: string;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export type WidgetConfiguration = 
  | ChartConfiguration
  | TableConfiguration
  | MetricConfiguration
  | GaugeConfiguration
  | MapConfiguration
  | TextConfiguration;

export interface ChartConfiguration {
  xAxis: AxisConfiguration;
  yAxis: AxisConfiguration[];
  series: SeriesConfiguration[];
  legend: LegendConfiguration;
  tooltip: TooltipConfiguration;
  annotations?: Annotation[];
}

export interface AxisConfiguration {
  field: string;
  label?: string;
  type: 'linear' | 'log' | 'category' | 'time';
  format?: string;
  min?: number;
  max?: number;
  ticks?: number;
}

export interface SeriesConfiguration {
  field: string;
  label: string;
  type: 'line' | 'bar' | 'area' | 'scatter';
  color?: string;
  stack?: boolean;
  smooth?: boolean;
  showPoints?: boolean;
}

export interface LegendConfiguration {
  show: boolean;
  position: 'top' | 'right' | 'bottom' | 'left';
  orientation: 'horizontal' | 'vertical';
}

export interface TooltipConfiguration {
  show: boolean;
  format?: string;
  shared?: boolean;
  crosshairs?: boolean;
}

export interface Annotation {
  type: 'line' | 'region' | 'text' | 'marker';
  value: any;
  label?: string;
  color?: string;
}

export interface TableConfiguration {
  columns: TableColumn[];
  pagination: boolean;
  pageSize?: number;
  sortable: boolean;
  filterable: boolean;
  rowActions?: TableAction[];
}

export interface TableColumn {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  format?: string;
  renderer?: 'text' | 'number' | 'date' | 'boolean' | 'link' | 'progress' | 'badge';
}

export interface TableAction {
  label: string;
  action: string;
  icon?: string;
  color?: string;
  condition?: string;
}

export interface MetricConfiguration {
  value: string;
  label: string;
  format?: string;
  compareTo?: string;
  showChange: boolean;
  showTrend: boolean;
  thresholds?: MetricThreshold[];
}

export interface MetricThreshold {
  value: number;
  color: string;
  label: string;
}

export interface GaugeConfiguration {
  value: string;
  min: number;
  max: number;
  label: string;
  format?: string;
  segments: GaugeSegment[];
  showValue: boolean;
  showMinMax: boolean;
}

export interface GaugeSegment {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export interface MapConfiguration {
  type: 'world' | 'country' | 'state' | 'custom';
  region?: string;
  field: string;
  colorScale: ColorScale;
  showLegend: boolean;
  showLabels: boolean;
  projection?: 'mercator' | 'albers' | 'orthographic';
}

export interface ColorScale {
  type: 'sequential' | 'diverging' | 'qualitative';
  colors: string[];
  domain?: number[];
}

export interface TextConfiguration {
  content: string;
  format: 'markdown' | 'html' | 'plain';
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  color?: string;
}

export interface WidgetInteraction {
  type: 'click' | 'hover' | 'select' | 'drilldown';
  action: string;
  target?: string;
  parameters?: Record<string, any>;
}

export interface WidgetStyling {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  shadow?: boolean;
}

export interface DashboardPermissions {
  view: string[];
  edit: string[];
  share: string[];
  export: string[];
  public: boolean;
}

export interface DashboardSettings {
  refreshInterval?: number;
  autoSave: boolean;
  showFilters: boolean;
  showExport: boolean;
  showFullscreen: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Analytics Models
export interface AnalyticsModel extends WithId, WithTimestamps {
  name: string;
  description?: string;
  type: ModelType;
  status: 'training' | 'ready' | 'failed' | 'archived';
  
  // Data
  dataSource: ModelDataSource;
  features: ModelFeature[];
  target: ModelTarget;
  
  // Training
  training: ModelTraining;
  hyperparameters: Record<string, any>;
  
  // Performance
  performance: ModelPerformance;
  
  // Deployment
  deployment: ModelDeployment;
  
  // Monitoring
  monitoring: ModelMonitoring;
  
  // Versioning
  version: string;
  parentVersion?: string;
  
  metadata?: Record<string, any>;
}

export type ModelType = 
  | 'regression'
  | 'classification'
  | 'clustering'
  | 'time_series'
  | 'anomaly_detection'
  | 'recommendation'
  | 'nlp'
  | 'computer_vision';

export interface ModelDataSource {
  type: 'query' | 'table' | 'file' | 'stream';
  query?: string;
  table?: string;
  fileUrl?: string;
  stream?: string;
  preprocessing: DataPreprocessing;
}

export interface DataPreprocessing {
  cleaning: DataCleaning[];
  transformation: DataTransformation[];
  scaling: DataScaling[];
  encoding: DataEncoding[];
}

export interface DataCleaning {
  type: 'missing_values' | 'outliers' | 'duplicates';
  method: string;
  parameters: Record<string, any>;
}

export interface DataTransformation {
  type: 'log' | 'square_root' | 'reciprocal' | 'box_cox';
  field: string;
  parameters: Record<string, any>;
}

export interface DataScaling {
  type: 'standard' | 'min_max' | 'robust';
  field: string;
  parameters: Record<string, any>;
}

export interface DataEncoding {
  type: 'one_hot' | 'label' | 'ordinal' | 'frequency';
  field: string;
  parameters: Record<string, any>;
}

export interface ModelFeature {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'text' | 'image';
  importance?: number;
  derived?: boolean;
  formula?: string;
}

export interface ModelTarget {
  name: string;
  type: 'numeric' | 'categorical' | 'binary';
  objective?: string;
}

export interface ModelTraining {
  algorithm: string;
  framework: string;
  trainingSetSize: number;
  validationSetSize: number;
  testSetSize: number;
  trainingStart: Date;
  trainingEnd: Date;
  epochs: number;
  batchSize: number;
  learningRate: number;
  earlyStopping: boolean;
  checkpointing: boolean;
}

export interface ModelPerformance {
  metrics: ModelMetrics;
  confusionMatrix?: ConfusionMatrix;
  rocCurve?: ROCCurve;
  learningCurve?: LearningCurve;
  featureImportance?: FeatureImportance[];
  predictions: ModelPrediction[];
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  mse?: number;
  mae?: number;
  rmse?: number;
  r2?: number;
  auc?: number;
  logLoss?: number;
}

export interface ConfusionMatrix {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
}

export interface ROCCurve {
  fpr: number[];
  tpr: number[];
  thresholds: number[];
}

export interface LearningCurve {
  trainSizes: number[];
  trainScores: number[];
  validationScores: number[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  std?: number;
}

export interface ModelPrediction {
  input: Record<string, any>;
  actual?: any;
  predicted: any;
  probability?: number;
  timestamp: Date;
}

export interface ModelDeployment {
  status: 'not_deployed' | 'staging' | 'production';
  endpoint?: string;
  apiKey?: string;
  deploymentDate?: Date;
  trafficPercentage: number;
  aBTesting: boolean;
  canaryReleases: boolean;
}

export interface ModelMonitoring {
  enabled: boolean;
  dataDrift: boolean;
  conceptDrift: boolean;
  performanceDecay: boolean;
  alerts: ModelAlert[];
  metrics: MonitoringMetrics[];
}

export interface ModelAlert {
  type: 'data_drift' | 'concept_drift' | 'performance_decay' | 'service_down';
  threshold: number;
  channel: NotificationChannel;
  recipients: string[];
}

export interface MonitoringMetrics {
  metric: string;
  value: number;
  timestamp: Date;
  expectedRange: {
    min: number;
    max: number;
  };
}

// Analytics Reports
export interface AnalyticsReport extends WithId, WithTimestamps {
  name: string;
  description?: string;
  type: ReportType;
  
  // Content
  content: ReportContent;
  
  // Schedule
  schedule: ReportSchedule;
  
  // Distribution
  distribution: ReportDistribution;
  
  // Status
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  lastRun?: ReportRun;
  nextRun?: Date;
  
  // Metadata
  tags: string[];
  metadata?: Record<string, any>;
}

export type ReportType = 
  | 'summary'
  | 'detailed'
  | 'comparative'
  | 'trend'
  | 'forecast'
  | 'diagnostic'
  | 'prescriptive';

export interface ReportContent {
  sections: ReportSection[];
  filters: ReportFilter[];
  visualizations: ReportVisualization[];
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
}

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'chart' | 'metric';
  content: any;
  order: number;
}

export interface ReportFilter {
  field: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text';
  defaultValue?: any;
  options?: any[];
}

export interface ReportVisualization {
  type: WidgetType;
  data: any;
  configuration: any;
}

export interface ReportInsight {
  title: string;
  description: string;
  type: 'observation' | 'anomaly' | 'trend' | 'correlation';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  dataPoints: any[];
}

export interface ReportRecommendation {
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  expectedImpact: string;
  owner?: string;
  deadline?: Date;
}

export interface ReportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: Date;
  endDate?: Date;
  timezone: string;
}

export interface ReportDistribution {
  recipients: string[];
  channels: NotificationChannel[];
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'json';
  attachment: boolean;
  notification: boolean;
  webhook?: string;
}

export interface ReportRun {
  id: string;
  reportId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  duration?: number;
  results?: ReportResults;
  error?: string;
}

export interface ReportResults {
  data: any;
  summary: any;
  visualizations: any[];
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
}
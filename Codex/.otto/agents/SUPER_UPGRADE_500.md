# OTTO Super Upgrade 500

Use this as a deep capability checklist. Do not load all items for every task. Master Orchestrator should pick only the useful parts.

## Core System

1. Choose the cheapest correct agent.
2. Avoid calling every agent.
3. Keep tasks small.
4. Track active task status.
5. Detect missing requirements.
6. Ask only needed questions.
7. Prefer existing project patterns.
8. Prevent agent conflicts.
9. Merge agent outputs.
10. Keep final answer short.
11. Use support agents only when useful.
12. Escalate model only when needed.
13. Block unsafe work early.
14. Track changed files.
15. Track open blockers.
16. Keep user goal central.
17. Create task checklist.
18. Update task board.
19. Record decisions.
20. Record lessons.
21. Avoid duplicate file edits.
22. Check latest user instruction.
23. Prefer direct implementation.
24. Keep context small.
25. Stop secret exposure.
26. Stop unsafe SQL.
27. Stop destructive commands.
28. Protect user changes.
29. Verify important changes.
30. Produce commit message.
31. Create Tagalog notes.
32. Summarize security risks.
33. Summarize tests.
34. Summarize next steps.
35. Keep logs useful.
36. Avoid noisy docs.
37. Use slash commands.
38. Route `/post` correctly.
39. Route `/get` correctly.
40. Route `/config` correctly.

## Fullstack Development

41. Create clean folder structure.
42. Separate app layers.
43. Build reusable modules.
44. Build reusable components.
45. Add validation.
46. Add error handling.
47. Add service layer.
48. Add controller layer.
49. Add route layer.
50. Add config layer.
51. Add tests when useful.
52. Avoid hardcoded secrets.
53. Use environment placeholders.
54. Use existing package style.
55. Keep dependencies minimal.
56. Prefer typed interfaces.
57. Add API examples.
58. Add request validation.
59. Add response formatting.
60. Add pagination when needed.
61. Add filtering when needed.
62. Add sorting when needed.
63. Add logging carefully.
64. Avoid logging secrets.
65. Optimize hot paths.
66. Keep functions focused.
67. Avoid giant files.
68. Use project conventions.
69. Refactor only needed code.
70. Avoid unrelated edits.
71. Integrate OpenCode when useful.
72. Generate files consistently.
73. Add setup instructions.
74. Add run instructions.
75. Add test instructions.
76. Check imports.
77. Check build errors.
78. Check lint issues.
79. Check runtime errors.
80. Hand off risky parts.

## API Config

81. Create `.ini` safely.
82. Create `.env.example` safely.
83. Create JSON config.
84. Create YAML config.
85. Use placeholders only.
86. Document config keys.
87. Keep config editable.
88. Group config sections.
89. Add safe defaults.
90. Add port settings.
91. Add base URL settings.
92. Add feature flags.
93. Add timeout settings.
94. Add retry settings.
95. Add logging level.
96. Add database placeholder.
97. Add auth placeholder.
98. Add mail placeholder.
99. Add storage placeholder.
100. Add cache placeholder.
101. Add queue placeholder.
102. Add CORS placeholder.
103. Add rate limit placeholder.
104. Add environment mode.
105. Add sample comments.
106. Avoid real credentials.
107. Avoid `.env` reads.
108. Validate config names.
109. Keep config portable.
110. Add config docs.

## GET/POST Endpoints

111. Create GET route.
112. Create POST route.
113. Validate POST body.
114. Validate query params.
115. Validate route params.
116. Add safe status codes.
117. Add request examples.
118. Add response examples.
119. Add error examples.
120. Add auth checks.
121. Add permission checks.
122. Add rate limit note.
123. Add service call.
124. Add controller call.
125. Add database handoff.
126. Add security handoff.
127. Avoid secret output.
128. Avoid unsafe writes.
129. Add pagination.
130. Add filtering.
131. Add sorting.
132. Add duplicate checks.
133. Add idempotency note.
134. Add input sanitization.
135. Add schema validation.
136. Add OpenAPI note.
137. Add route docs.
138. Add tests.
139. Add commit message.
140. Keep routes consistent.

## Database

141. Default readonly.
142. Allow SELECT.
143. Allow SHOW.
144. Allow DESCRIBE.
145. Allow EXPLAIN.
146. Block DELETE.
147. Block DROP.
148. Block TRUNCATE.
149. Block unsafe UPDATE.
150. Ask approval for writes.
151. Review schema.
152. Review indexes.
153. Review relationships.
154. Find duplicate risks.
155. Find slow query risk.
156. Suggest indexes.
157. Explain query plan.
158. Avoid full scans.
159. Check joins.
160. Check null handling.
161. Check constraints.
162. Check unique keys.
163. Check foreign keys.
164. Check migration safety.
165. Suggest backups.
166. Avoid data loss.
167. Validate analytics query.
168. Validate aggregates.
169. Explain SQL in Tagalog.
170. Log query risks.
171. Protect sensitive columns.
172. Avoid exposing PII.
173. Use transactions for approved writes.
174. Check rollback plan.
175. Check database permissions.
176. Keep query readable.
177. Use parameters.
178. Avoid SQL injection.
179. Coordinate with Security.
180. Coordinate with Reports.

## Security

181. Never expose `.env`.
182. Never print API keys.
183. Never print tokens.
184. Never print passwords.
185. Never print private keys.
186. Redact secrets.
187. Check auth logic.
188. Check JWT expiry.
189. Check password hashing.
190. Check role permissions.
191. Check admin routes.
192. Check CORS.
193. Check CSRF risk.
194. Check SQL injection.
195. Check XSS risk.
196. Check file upload risk.
197. Check path traversal.
198. Check rate limiting.
199. Check brute force risk.
200. Check session handling.
201. Check cookie security.
202. Check HTTPS needs.
203. Check dependency risk.
204. Check logging risk.
205. Check error leaks.
206. Check deployment secrets.
207. Check backup safety.
208. Check permission scope.
209. Block unsafe commands.
210. Block secret commits.
211. Review `.gitignore`.
212. Use placeholders.
213. Avoid real credentials.
214. Add security notes.
215. Escalate high risk.
216. Require approval for risky actions.
217. Protect database data.
218. Protect user data.
219. Coordinate with Orchestrator.
220. Coordinate with QA.

## Automation And Deployment

221. Create Dockerfile.
222. Create compose file.
223. Add health check.
224. Add restart policy.
225. Add build command.
226. Add run command.
227. Add env placeholders.
228. Avoid secret output.
229. Add deploy steps.
230. Add rollback steps.
231. Add backup steps.
232. Add migration warning.
233. Add CI workflow.
234. Add lint step.
235. Add test step.
236. Add build step.
237. Add deploy step.
238. Add VPS notes.
239. Add Nginx notes.
240. Add PM2 notes.
241. Add cron notes.
242. Add monitoring notes.
243. Add log rotation.
244. Add storage notes.
245. Add cache notes.
246. Add queue notes.
247. Add domain notes.
248. Add SSL notes.
249. Check ports.
250. Check firewall.
251. Check permissions.
252. Check process manager.
253. Check database backup.
254. Check uptime risk.
255. Check rollback path.
256. Keep commands copy-ready.
257. Keep docs short.
258. Coordinate with Security.
259. Coordinate with Docs.
260. Log deployment decisions.

## Memory And Learning

261. Log mistakes.
262. Log causes.
263. Log prevention.
264. Log successful patterns.
265. Keep notes short.
266. Avoid secrets.
267. Update audit log.
268. Update task board.
269. Update decisions.
270. Track repeated errors.
271. Track user corrections.
272. Track bad assumptions.
273. Track unsafe attempts.
274. Track failed tests.
275. Track fixed bugs.
276. Track design decisions.
277. Track deployment lessons.
278. Track database lessons.
279. Track security lessons.
280. Track cost lessons.
281. Improve future routing.
282. Avoid repeated verbose answers.
283. Avoid repeated wrong edits.
284. Avoid repeated file clutter.
285. Avoid repeated unsafe SQL.
286. Avoid repeated secret risk.
287. Avoid repeated UI overflow.
288. Avoid repeated missing tests.
289. Avoid repeated missing docs.
290. Avoid repeated command errors.
291. Summarize lesson in Tagalog.
292. Keep memory actionable.
293. Archive stale notes.
294. Keep active notes visible.
295. Never store credentials.
296. Coordinate with QA.
297. Coordinate with Docs.
298. Coordinate with Orchestrator.
299. Use logs as memory.
300. Keep memory low-cost.

## UI/UX

301. Build usable screen first.
302. Avoid fake landing page.
303. Use responsive layout.
304. Check mobile layout.
305. Check tablet layout.
306. Check desktop layout.
307. Prevent text overflow.
308. Prevent element overlap.
309. Use reusable components.
310. Use accessible contrast.
311. Use proper labels.
312. Use keyboard-friendly controls.
313. Use forms properly.
314. Use tables properly.
315. Use filters properly.
316. Use tabs properly.
317. Use dialogs carefully.
318. Use icons where useful.
319. Keep cards minimal.
320. Avoid nested cards.
321. Avoid noisy decoration.
322. Use clear spacing.
323. Use stable dimensions.
324. Use loading states.
325. Use empty states.
326. Use error states.
327. Use success states.
328. Add validation states.
329. Add disabled states.
330. Add hover states.
331. Keep design editable.
332. Split sections clearly.
333. Match app domain.
334. Avoid marketing style for tools.
335. Use dashboard density when needed.
336. Verify screenshots when needed.
337. Coordinate with Fullstack.
338. Coordinate with QA.
339. Log design decisions.
340. Add UI summary.

## RAG And Vision

341. Read screenshots.
342. Read documents.
343. Extract OCR text.
344. Read forms.
345. Read barcodes.
346. Read QR codes.
347. Search docs.
348. Search manuals.
349. Search project notes.
350. Extract requirements.
351. Extract errors from screenshots.
352. Extract UI issues.
353. Extract data from images.
354. Summarize only relevant facts.
355. Protect sensitive text.
356. Avoid dumping full documents.
357. Cite source files.
358. Send UI issues to UI agent.
359. Send docs needs to Docs agent.
360. Send risks to Security.
361. Use vision only when needed.
362. Use mini for text search.
363. Keep findings short.
364. Identify blockers.
365. Identify next agent.
366. Avoid hallucinating OCR.
367. Mark uncertain readings.
368. Ask for clearer image if needed.
369. Log useful findings.
370. Keep context focused.

## Analytics And Reports

371. Define KPIs.
372. Validate formulas.
373. Use readonly data.
374. Check aggregation.
375. Check date ranges.
376. Check filters.
377. Check grouping.
378. Check sorting.
379. Create chart logic.
380. Create dashboard layout.
381. Create PDF export.
382. Create Excel export.
383. Create CSV export.
384. Create summary cards.
385. Create trend charts.
386. Create comparison charts.
387. Create tables.
388. Create filters.
389. Create drilldowns.
390. Check empty data.
391. Check large data.
392. Check performance.
393. Explain metrics.
394. Explain in Tagalog when useful.
395. Coordinate with Database.
396. Coordinate with UI.
397. Coordinate with Docs.
398. Log metric definitions.
399. Avoid misleading charts.
400. Keep reports editable.

## Debug And QA

401. Reproduce issue.
402. Read error message.
403. Read logs safely.
404. Identify root cause.
405. Avoid random changes.
406. Fix smallest scope.
407. Run focused tests.
408. Run build check.
409. Run lint check.
410. Run type check.
411. Check regression risk.
412. Check edge cases.
413. Check error paths.
414. Check auth paths.
415. Check database paths.
416. Check UI paths.
417. Check mobile paths.
418. Check performance.
419. Check import errors.
420. Check config errors.
421. Check dependency errors.
422. Check environment placeholders.
423. Avoid reading `.env`.
424. Summarize cause.
425. Summarize fix.
426. Summarize tests.
427. Log repeated mistakes.
428. Coordinate with Memory.
429. Coordinate with Security.
430. Verify final state.

## Documentation

431. Write README.
432. Write setup guide.
433. Write run guide.
434. Write test guide.
435. Write deploy guide.
436. Write API docs.
437. Write config docs.
438. Write Tagalog notes.
439. Write tutorial steps.
440. Write change summary.
441. Write commit message.
442. Keep docs short.
443. Keep docs editable.
444. Avoid secrets.
445. Avoid outdated steps.
446. Include commands.
447. Include paths.
448. Include examples.
449. Include warnings.
450. Include assumptions.
451. Include tested status.
452. Include security notes.
453. Include rollback notes.
454. Include troubleshooting.
455. Include next steps.
456. Document decisions.
457. Document endpoints.
458. Document models.
459. Document UI sections.
460. Document database changes.
461. Explain in Tagalog.
462. Keep commit concise.
463. Match actual changes.
464. Coordinate with QA.
465. Coordinate with Memory.
466. Update audit log.
467. Avoid overexplaining.
468. Use clear headings.
469. Use markdown tables only when useful.
470. Finalize user handoff.

## Fast Utility

471. Answer simple questions.
472. Keep answers short.
473. Format text.
474. Fix small typos.
475. Run quick checks.
476. Summarize files.
477. Create small snippets.
478. Avoid heavy tools.
479. Avoid web unless needed.
480. Avoid model escalation.
481. Escalate coding tasks.
482. Escalate security tasks.
483. Escalate database tasks.
484. Escalate UI tasks.
485. Escalate deployment tasks.
486. Do not touch secrets.
487. Do not run risky commands.
488. Do not create noisy docs.
489. Keep low cost.
490. Give direct result.
491. Mention changed file.
492. Mention if no changes.
493. Mention blocker.
494. Mention next agent.
495. Use slash commands.
496. Update task board if useful.
497. Update audit log if files changed.
498. Respect newest request.
499. Stop when done.
500. Stay fast.

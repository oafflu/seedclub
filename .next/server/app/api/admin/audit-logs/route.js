/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/audit-logs/route";
exports.ids = ["app/api/admin/audit-logs/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/audit-logs/route.ts":
/*!*******************************************!*\
  !*** ./app/api/admin/audit-logs/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/admin */ \"(rsc)/./lib/supabase/admin.ts\");\n\n\nasync function GET(req) {\n    const { searchParams } = new URL(req.url);\n    const page = parseInt(searchParams.get('page') || '1', 10);\n    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);\n    const action = searchParams.get('action');\n    const user = searchParams.get('user');\n    const resource = searchParams.get('resource');\n    const start = searchParams.get('start');\n    const end = searchParams.get('end');\n    const search = searchParams.get('search');\n    const distinct = searchParams.get('distinct');\n    if (distinct) {\n        // Only allow certain fields for security\n        const allowed = [\n            'action',\n            'resource',\n            'user_name',\n            'userName'\n        ];\n        if (!allowed.includes(distinct)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid distinct field'\n            }, {\n                status: 400\n            });\n        }\n        const { data, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('audit_logs').select(`${distinct}`).neq(distinct, '').order(distinct, {\n            ascending: true\n        });\n        if (error) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: error.message\n            }, {\n                status: 500\n            });\n        }\n        // Return unique values only\n        const unique = Array.from(new Set((data || []).map((row)=>row[distinct]))).filter(Boolean);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            values: unique\n        });\n    }\n    let query = _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('audit_logs').select('*', {\n        count: 'exact'\n    });\n    if (action) query = query.eq('action', action);\n    if (user) query = query.or(`userName.eq.${user},user_name.eq.${user}`);\n    if (resource) query = query.eq('resource', resource);\n    if (start) query = query.gte('performed_at', start);\n    if (end) query = query.lte('performed_at', end);\n    if (search) {\n        query = query.or(`details.ilike.%${search}%,action.ilike.%${search}%,userName.ilike.%${search}%,user_name.ilike.%${search}%,resource.ilike.%${search}%`);\n    }\n    query = query.order('performed_at', {\n        ascending: false\n    }).range((page - 1) * pageSize, page * pageSize - 1);\n    const { data, error, count } = await query;\n    if (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        logs: data,\n        total: count\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2F1ZGl0LWxvZ3Mvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ1U7QUFFN0MsZUFBZUUsSUFBSUMsR0FBWTtJQUNwQyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLElBQUlHLEdBQUc7SUFDeEMsTUFBTUMsT0FBT0MsU0FBU0osYUFBYUssR0FBRyxDQUFDLFdBQVcsS0FBSztJQUN2RCxNQUFNQyxXQUFXRixTQUFTSixhQUFhSyxHQUFHLENBQUMsZUFBZSxNQUFNO0lBQ2hFLE1BQU1FLFNBQVNQLGFBQWFLLEdBQUcsQ0FBQztJQUNoQyxNQUFNRyxPQUFPUixhQUFhSyxHQUFHLENBQUM7SUFDOUIsTUFBTUksV0FBV1QsYUFBYUssR0FBRyxDQUFDO0lBQ2xDLE1BQU1LLFFBQVFWLGFBQWFLLEdBQUcsQ0FBQztJQUMvQixNQUFNTSxNQUFNWCxhQUFhSyxHQUFHLENBQUM7SUFDN0IsTUFBTU8sU0FBU1osYUFBYUssR0FBRyxDQUFDO0lBQ2hDLE1BQU1RLFdBQVdiLGFBQWFLLEdBQUcsQ0FBQztJQUVsQyxJQUFJUSxVQUFVO1FBQ1oseUNBQXlDO1FBQ3pDLE1BQU1DLFVBQVU7WUFBQztZQUFVO1lBQVk7WUFBYTtTQUFXO1FBQy9ELElBQUksQ0FBQ0EsUUFBUUMsUUFBUSxDQUFDRixXQUFXO1lBQy9CLE9BQU9qQixxREFBWUEsQ0FBQ29CLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUF5QixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDOUU7UUFDQSxNQUFNLEVBQUVDLElBQUksRUFBRUYsS0FBSyxFQUFFLEdBQUcsTUFBTXBCLDhEQUFhQSxDQUFDdUIsSUFBSSxDQUFDLGNBQWNDLE1BQU0sQ0FBQyxHQUFHUixVQUFVLEVBQUVTLEdBQUcsQ0FBQ1QsVUFBVSxJQUFJVSxLQUFLLENBQUNWLFVBQVU7WUFBRVcsV0FBVztRQUFLO1FBQ3pJLElBQUlQLE9BQU87WUFDVCxPQUFPckIscURBQVlBLENBQUNvQixJQUFJLENBQUM7Z0JBQUVDLE9BQU9BLE1BQU1RLE9BQU87WUFBQyxHQUFHO2dCQUFFUCxRQUFRO1lBQUk7UUFDbkU7UUFDQSw0QkFBNEI7UUFDNUIsTUFBTVEsU0FBU0MsTUFBTVAsSUFBSSxDQUFDLElBQUlRLElBQUksQ0FBQ1QsUUFBUSxFQUFFLEVBQUVVLEdBQUcsQ0FBQyxDQUFDQyxNQUFhQSxHQUFHLENBQUNqQixTQUFTLElBQUlrQixNQUFNLENBQUNDO1FBQ3pGLE9BQU9wQyxxREFBWUEsQ0FBQ29CLElBQUksQ0FBQztZQUFFaUIsUUFBUVA7UUFBTztJQUM1QztJQUVBLElBQUlRLFFBQVFyQyw4REFBYUEsQ0FBQ3VCLElBQUksQ0FBQyxjQUFjQyxNQUFNLENBQUMsS0FBSztRQUFFYyxPQUFPO0lBQVE7SUFFMUUsSUFBSTVCLFFBQVEyQixRQUFRQSxNQUFNRSxFQUFFLENBQUMsVUFBVTdCO0lBQ3ZDLElBQUlDLE1BQU0wQixRQUFRQSxNQUFNRyxFQUFFLENBQUMsQ0FBQyxZQUFZLEVBQUU3QixLQUFLLGNBQWMsRUFBRUEsTUFBTTtJQUNyRSxJQUFJQyxVQUFVeUIsUUFBUUEsTUFBTUUsRUFBRSxDQUFDLFlBQVkzQjtJQUMzQyxJQUFJQyxPQUFPd0IsUUFBUUEsTUFBTUksR0FBRyxDQUFDLGdCQUFnQjVCO0lBQzdDLElBQUlDLEtBQUt1QixRQUFRQSxNQUFNSyxHQUFHLENBQUMsZ0JBQWdCNUI7SUFDM0MsSUFBSUMsUUFBUTtRQUNWc0IsUUFBUUEsTUFBTUcsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFekIsT0FBTyxnQkFBZ0IsRUFBRUEsT0FBTyxrQkFBa0IsRUFBRUEsT0FBTyxtQkFBbUIsRUFBRUEsT0FBTyxrQkFBa0IsRUFBRUEsT0FBTyxDQUFDLENBQUM7SUFDeko7SUFFQXNCLFFBQVFBLE1BQU1YLEtBQUssQ0FBQyxnQkFBZ0I7UUFBRUMsV0FBVztJQUFNLEdBQ3BEZ0IsS0FBSyxDQUFDLENBQUNyQyxPQUFPLEtBQUtHLFVBQVVILE9BQU9HLFdBQVc7SUFFbEQsTUFBTSxFQUFFYSxJQUFJLEVBQUVGLEtBQUssRUFBRWtCLEtBQUssRUFBRSxHQUFHLE1BQU1EO0lBQ3JDLElBQUlqQixPQUFPO1FBQ1QsT0FBT3JCLHFEQUFZQSxDQUFDb0IsSUFBSSxDQUFDO1lBQUVDLE9BQU9BLE1BQU1RLE9BQU87UUFBQyxHQUFHO1lBQUVQLFFBQVE7UUFBSTtJQUNuRTtJQUNBLE9BQU90QixxREFBWUEsQ0FBQ29CLElBQUksQ0FBQztRQUFFeUIsTUFBTXRCO1FBQU11QixPQUFPUDtJQUFNO0FBQ3REIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vYXVkaXQtbG9ncy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IHN1cGFiYXNlQWRtaW4gfSBmcm9tICdAL2xpYi9zdXBhYmFzZS9hZG1pbidcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXE6IFJlcXVlc3QpIHtcbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxLnVybClcbiAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2UnKSB8fCAnMScsIDEwKVxuICBjb25zdCBwYWdlU2l6ZSA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2VTaXplJykgfHwgJzIwJywgMTApXG4gIGNvbnN0IGFjdGlvbiA9IHNlYXJjaFBhcmFtcy5nZXQoJ2FjdGlvbicpXG4gIGNvbnN0IHVzZXIgPSBzZWFyY2hQYXJhbXMuZ2V0KCd1c2VyJylcbiAgY29uc3QgcmVzb3VyY2UgPSBzZWFyY2hQYXJhbXMuZ2V0KCdyZXNvdXJjZScpXG4gIGNvbnN0IHN0YXJ0ID0gc2VhcmNoUGFyYW1zLmdldCgnc3RhcnQnKVxuICBjb25zdCBlbmQgPSBzZWFyY2hQYXJhbXMuZ2V0KCdlbmQnKVxuICBjb25zdCBzZWFyY2ggPSBzZWFyY2hQYXJhbXMuZ2V0KCdzZWFyY2gnKVxuICBjb25zdCBkaXN0aW5jdCA9IHNlYXJjaFBhcmFtcy5nZXQoJ2Rpc3RpbmN0JylcblxuICBpZiAoZGlzdGluY3QpIHtcbiAgICAvLyBPbmx5IGFsbG93IGNlcnRhaW4gZmllbGRzIGZvciBzZWN1cml0eVxuICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2FjdGlvbicsICdyZXNvdXJjZScsICd1c2VyX25hbWUnLCAndXNlck5hbWUnXVxuICAgIGlmICghYWxsb3dlZC5pbmNsdWRlcyhkaXN0aW5jdCkpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBkaXN0aW5jdCBmaWVsZCcgfSwgeyBzdGF0dXM6IDQwMCB9KVxuICAgIH1cbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ2F1ZGl0X2xvZ3MnKS5zZWxlY3QoYCR7ZGlzdGluY3R9YCkubmVxKGRpc3RpbmN0LCAnJykub3JkZXIoZGlzdGluY3QsIHsgYXNjZW5kaW5nOiB0cnVlIH0pXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pXG4gICAgfVxuICAgIC8vIFJldHVybiB1bmlxdWUgdmFsdWVzIG9ubHlcbiAgICBjb25zdCB1bmlxdWUgPSBBcnJheS5mcm9tKG5ldyBTZXQoKGRhdGEgfHwgW10pLm1hcCgocm93OiBhbnkpID0+IHJvd1tkaXN0aW5jdF0pKSkuZmlsdGVyKEJvb2xlYW4pXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgdmFsdWVzOiB1bmlxdWUgfSlcbiAgfVxuXG4gIGxldCBxdWVyeSA9IHN1cGFiYXNlQWRtaW4uZnJvbSgnYXVkaXRfbG9ncycpLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcgfSlcblxuICBpZiAoYWN0aW9uKSBxdWVyeSA9IHF1ZXJ5LmVxKCdhY3Rpb24nLCBhY3Rpb24pXG4gIGlmICh1c2VyKSBxdWVyeSA9IHF1ZXJ5Lm9yKGB1c2VyTmFtZS5lcS4ke3VzZXJ9LHVzZXJfbmFtZS5lcS4ke3VzZXJ9YClcbiAgaWYgKHJlc291cmNlKSBxdWVyeSA9IHF1ZXJ5LmVxKCdyZXNvdXJjZScsIHJlc291cmNlKVxuICBpZiAoc3RhcnQpIHF1ZXJ5ID0gcXVlcnkuZ3RlKCdwZXJmb3JtZWRfYXQnLCBzdGFydClcbiAgaWYgKGVuZCkgcXVlcnkgPSBxdWVyeS5sdGUoJ3BlcmZvcm1lZF9hdCcsIGVuZClcbiAgaWYgKHNlYXJjaCkge1xuICAgIHF1ZXJ5ID0gcXVlcnkub3IoYGRldGFpbHMuaWxpa2UuJSR7c2VhcmNofSUsYWN0aW9uLmlsaWtlLiUke3NlYXJjaH0lLHVzZXJOYW1lLmlsaWtlLiUke3NlYXJjaH0lLHVzZXJfbmFtZS5pbGlrZS4lJHtzZWFyY2h9JSxyZXNvdXJjZS5pbGlrZS4lJHtzZWFyY2h9JWApXG4gIH1cblxuICBxdWVyeSA9IHF1ZXJ5Lm9yZGVyKCdwZXJmb3JtZWRfYXQnLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAucmFuZ2UoKHBhZ2UgLSAxKSAqIHBhZ2VTaXplLCBwYWdlICogcGFnZVNpemUgLSAxKVxuXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IsIGNvdW50IH0gPSBhd2FpdCBxdWVyeVxuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbG9nczogZGF0YSwgdG90YWw6IGNvdW50IH0pXG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZUFkbWluIiwiR0VUIiwicmVxIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicGFnZSIsInBhcnNlSW50IiwiZ2V0IiwicGFnZVNpemUiLCJhY3Rpb24iLCJ1c2VyIiwicmVzb3VyY2UiLCJzdGFydCIsImVuZCIsInNlYXJjaCIsImRpc3RpbmN0IiwiYWxsb3dlZCIsImluY2x1ZGVzIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZGF0YSIsImZyb20iLCJzZWxlY3QiLCJuZXEiLCJvcmRlciIsImFzY2VuZGluZyIsIm1lc3NhZ2UiLCJ1bmlxdWUiLCJBcnJheSIsIlNldCIsIm1hcCIsInJvdyIsImZpbHRlciIsIkJvb2xlYW4iLCJ2YWx1ZXMiLCJxdWVyeSIsImNvdW50IiwiZXEiLCJvciIsImd0ZSIsImx0ZSIsInJhbmdlIiwibG9ncyIsInRvdGFsIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/audit-logs/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/admin.ts":
/*!*******************************!*\
  !*** ./lib/supabase/admin.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://rmyblssbxxoqmemfdupl.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error('Missing required Supabase environment variables');\n}\n// Create a Supabase client with service role key\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey, {\n    auth: {\n        autoRefreshToken: true,\n        persistSession: true,\n        detectSessionInUrl: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvYWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLHlCQUF5QkgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7QUFFcEUsSUFBSSxDQUFDTCxlQUFlLENBQUNJLHdCQUF3QjtJQUMzQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFQSxpREFBaUQ7QUFDMUMsTUFBTUMsZ0JBQWdCUixtRUFBWUEsQ0FBQ0MsYUFBYUksd0JBQXdCO0lBQzdFSSxNQUFNO1FBQ0pDLGtCQUFrQjtRQUNsQkMsZ0JBQWdCO1FBQ2hCQyxvQkFBb0I7SUFDdEI7QUFDRixHQUFFIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2xpYi9zdXBhYmFzZS9hZG1pbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIVxuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG59XG5cbi8vIENyZWF0ZSBhIFN1cGFiYXNlIGNsaWVudCB3aXRoIHNlcnZpY2Ugcm9sZSBrZXlcbmV4cG9ydCBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VSb2xlS2V5LCB7XG4gIGF1dGg6IHtcbiAgICBhdXRvUmVmcmVzaFRva2VuOiB0cnVlLFxuICAgIHBlcnNpc3RTZXNzaW9uOiB0cnVlLFxuICAgIGRldGVjdFNlc3Npb25JblVybDogZmFsc2UsXG4gIH1cbn0pICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZVNlcnZpY2VSb2xlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIkVycm9yIiwic3VwYWJhc2VBZG1pbiIsImF1dGgiLCJhdXRvUmVmcmVzaFRva2VuIiwicGVyc2lzdFNlc3Npb24iLCJkZXRlY3RTZXNzaW9uSW5VcmwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/admin.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Faudit-logs%2Froute&page=%2Fapi%2Fadmin%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Faudit-logs%2Froute&page=%2Fapi%2Fadmin%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_audit_logs_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/audit-logs/route.ts */ \"(rsc)/./app/api/admin/audit-logs/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/audit-logs/route\",\n        pathname: \"/api/admin/audit-logs\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/audit-logs/route\"\n    },\n    resolvedPagePath: \"/Users/obedkafflu/Documents/GitHub/seedclub/app/api/admin/audit-logs/route.ts\",\n    nextConfigOutput,\n    userland: _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_audit_logs_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmF1ZGl0LWxvZ3MlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmFkbWluJTJGYXVkaXQtbG9ncyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmFkbWluJTJGYXVkaXQtbG9ncyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm9iZWRrYWZmbHUlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzZWVkY2x1YiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZvYmVka2FmZmx1JTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGc2VlZGNsdWImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzZCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vYXVkaXQtbG9ncy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYWRtaW4vYXVkaXQtbG9ncy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FkbWluL2F1ZGl0LWxvZ3NcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL2F1ZGl0LWxvZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vYXVkaXQtbG9ncy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Faudit-logs%2Froute&page=%2Fapi%2Fadmin%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Faudit-logs%2Froute&page=%2Fapi%2Fadmin%2Faudit-logs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Faudit-logs%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
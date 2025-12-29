package io.github.pengxianggui.crud.demo.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import io.github.pengxianggui.crud.BaseController;
import io.github.pengxianggui.crud.CrudExclude;
import io.github.pengxianggui.crud.demo.controller.vo.StudentDetailVO;
import io.github.pengxianggui.crud.demo.controller.vo.StudentPageVO;
import io.github.pengxianggui.crud.demo.service.StudentService;
import io.github.pengxianggui.crud.query.PagerQuery;
import io.github.pengxianggui.crud.query.PagerView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@CrudExclude()
@Api(tags = "学生")
@RestController
@RequestMapping("student")
public class StudentController extends BaseController<StudentPageVO> {

    @Resource
    private StudentService studentService;

    public StudentController(StudentService studentService) {
        super(studentService, StudentPageVO.class);
    }


    @ApiOperation("分页查询")
    @PostMapping("page")
    public PagerView<StudentPageVO> page(@RequestBody @Validated PagerQuery query) {
        IPage<StudentPageVO> pager = studentService.pageVO(query);
        return new PagerView<>(pager.getCurrent(), pager.getSize(), pager.getTotal(), pager.getRecords());
    }

    @ApiOperation("详情-自定义")
    @GetMapping("{id}/detail-vo")
    public StudentDetailVO detailVO(@PathVariable Integer id) {
        return studentService.getById(id, StudentDetailVO.class);
    }
}

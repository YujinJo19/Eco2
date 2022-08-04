package com.web.eco2.controller.post;


import com.web.eco2.domain.dto.post.CommentCreateDto;
import com.web.eco2.domain.entity.post.Comment;
import com.web.eco2.model.repository.post.PostRepository;
import com.web.eco2.model.repository.user.UserRepository;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/post")
@Transactional
@Api(tags = {"Comment API"})
@Slf4j
public class CommentController {

//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PostRepository postRepository;
//
//    @PostMapping("/{post_id}/comment")
//    public ResponseEntity<Object> createPostComment(@RequestParam("postId") Long postId,
//                                                    @RequestBody CommentCreateDto commentCreateDto) {
//        Comment.builder()
//                .content(commentCreateDto.getContent())
//                .user(userRepository.getById(commentCreateDto.getUserId()))
//                .post(postRepository.getById(commentCreateDto.getPostId()))
//                .comment(commentCreateDto.getCommentId())
//                .comments()
//
//
//    }
}

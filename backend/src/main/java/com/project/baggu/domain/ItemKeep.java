package com.project.baggu.domain;
import static javax.persistence.FetchType.LAZY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "item_keep")
@Getter
@Setter
@NoArgsConstructor
public class ItemKeep extends BaseTimeEntity{

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "item_keep_idx")
  private Long itemKeepIdx;

  @Column(name = "is_valid")
  private boolean isValid = true;

  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "user_idx")
  private User user;

  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "item_idx")
  private Item item;

  public void setUser(User user) {
    this.user = user;
    user.getItemKeeps().add(this);
  }

  public void setItem(Item item) {
    this.item = item;
    user.getItemKeeps().add(this);
  }

}

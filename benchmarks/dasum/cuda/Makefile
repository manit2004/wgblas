CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dasum

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dasum: dasum.c $(HDRS) | $(BIN)
	$(CC) dasum.c -o $(BIN)/dasum -lcublas

clean:
	rm -rf $(BIN)
